"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useForm } from "@/hooks";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useLocation } from "@/hooks/useLocation";
import { useReports } from "@/hooks/api/useReports";
import { toast } from "sonner";
import { handleAPIError } from "@/lib/Error";
import { generateReport } from "@/lib/report";

interface ReportData {
  title: string;
  division: any;
  district: any;
  description: any;
  images?: string[];
  crimeTime: Date;
  postTime: Date;
  userId: string;
  divisionCoordinates: string;
  districtCoordinates: string;
  crimeType: string;
}

interface ReportFormContextType {
  language: "EN" | "BN";
  setLanguage: (lang: "EN" | "BN") => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  isAutoMode: boolean;
  setIsAutoMode: (mode: boolean) => void;
  formData: ReportData;
  isSubmitting: boolean;
  handleChange: (field: keyof ReportData, value: any) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAIAutoGeneration: () => Promise<void>;
  handleAICustomGeneration: () => Promise<void>;
  handleDivisionChange: (value: string) => void;
  handleDistrictChange: (value: string) => void;
  imagePreview: string[];
  uploadingImages: Set<string>;
  divisions: any[];
  districts: any[];
  removeImage: (index: number) => void;
}

const ReportFormContext = createContext<ReportFormContextType | null>(null);

export const useReportForm = (user: any) => {
  const [language, setLanguage] = useState<"EN" | "BN">("EN");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isAutoMode, setIsAutoMode] = useState(true);

  const { createReport } = useReports();
  const {
    imagePreview,
    setImagePreview,
    uploadingImages,
    handleImageUpload,
    removeImage,
  } = useImageUpload();
  const { divisions, districts, fetchDistricts } = useLocation();

  const {
    values: formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    setValues: setFormData,
    setIsSubmitting,
  } = useForm<ReportData>({
    initialValues: {
      title: "",
      division: "",
      district: "",
      crimeType: "",
      description: "",
      images: [],
      crimeTime: new Date(),
      postTime: new Date(),
      userId: user?._id,
      divisionCoordinates: "",
      districtCoordinates: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};
      if (!values.title) errors.title = "Title is required";
      if (!values.division) errors.division = "Division is required";
      if (!values.district) errors.district = "District is required";
      if (!values.description) errors.description = "Description is required";
      if (!values.userId) errors.userId = "User must be logged in";
      if (!values.images?.length)
        errors.images = "At least one image is required";
      return errors;
    },
    onSubmit: async (values) => {
      createReport.mutate(values, {
        onSuccess: () => {
          toast.success("Report submitted successfully!");
          setFormData({
            title: "",
            division: "",
            district: "",
            description: "",
            images: [],
            crimeTime: new Date(),
            postTime: new Date(),
            userId: user?._id,
            divisionCoordinates: "",
            districtCoordinates: "",
            crimeType: "",
          });
          setImagePreview([]);
          removeImage(0);
        },
        onError: (error) => {
          handleAPIError(error);
        },
      });
    },
  });

  const wrappedHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    await handleSubmit(e);
  };

  useEffect(() => {
    if (formData.division && !formData.district) {
      fetchDistricts(formData.division);
    }
  }, [formData.division]);

  useEffect(() => {
    if (user?._id && !formData.userId) {
      setFormData((prev) => ({
        ...prev,
        userId: user._id,
      }));
    }
  }, [user?._id]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const uploadedUrls = await handleImageUpload(files);
    setFormData({
      ...formData,
      images: [...(formData.images || []), ...uploadedUrls],
    });
  };

  const handleAIAutoGeneration = async () => {
    const { images, division, district } = formData;
    setIsSubmitting(true);
    const data = await generateReport(
      images || [],
      division,
      district,
      language
    );
    if (data) {
      const { title, description, crimeType } = data;
      setFormData({
        ...formData,
        title,
        description,
        crimeType,
      });
    }

    setIsSubmitting(false);
  };

  const handleAICustomGeneration = async () => {
    if (!customPrompt) return;

    const { images, division, district } = formData;
    setIsSubmitting(true);
    const data = await generateReport(
      images || [],
      division,
      district,
      language,
      customPrompt
    );
    if (data) {
      const { title, description, crimeType } = data;
      setFormData({
        ...formData,
        title,
        description,
        crimeType,
      });
    }
    setIsSubmitting(false);
    setCustomPrompt("");
  };

  const handleDivisionChange = (value: string) => {
    const selectedDivision = divisions.find(
      (div) => div?.division?.toLowerCase() === value
    );
    handleChange("division", value);
    handleChange("divisionCoordinates", selectedDivision?.coordinates || "");
    handleChange("district", "");
    handleChange("districtCoordinates", "");
  };

  const handleDistrictChange = (value: any) => {
    const selectedDistrict: any = districts.find(
      (dist: any) => dist.name.toLowerCase() === value.name.toLowerCase()
    );
    handleChange("district", value.name);
    handleChange(
      "districtCoordinates",
      `${selectedDistrict?.lat},${selectedDistrict?.lon}` || ""
    );
  };

  return {
    language,
    setLanguage,
    customPrompt,
    setCustomPrompt,
    isAutoMode,
    setIsAutoMode,
    formData,
    isSubmitting,
    handleChange,
    handleSubmit: wrappedHandleSubmit,
    handleImageChange,
    handleAIAutoGeneration,
    handleAICustomGeneration,
    handleDivisionChange,
    handleDistrictChange,
    imagePreview,
    uploadingImages,
    divisions,
    districts,
    removeImage,
  };
};

export const useReportFormContext = () => {
  const context = useContext(ReportFormContext);
  if (!context) {
    throw new Error(
      "useReportFormContext must be used within a ReportFormProvider"
    );
  }
  return context;
};

export const ReportFormProvider = ReportFormContext.Provider;

"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ImagePlus,
  VideoIcon,
  X,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { SelectComponent } from "../select-component";
import { SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { handleAPIError } from "@/lib/Error";
import { useReports } from "@/hooks/api/useReports";
import { useForm } from "@/hooks";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useLocation } from "@/hooks/useLocation";
import { generateReport } from "@/lib/report";

type Props = {
  onSubmit?: (data: ReportData) => void;
  user: any;
};

interface ReportData {
  title: string;
  division: string;
  district: string;
  description: string;
  images?: string[];
  crimeTime: Date;
  postTime: Date;
  userId: string;
  divisionCoordinates: string;
  districtCoordinates: string;
}

const CreateReportCard = ({ onSubmit, user }: Props) => {
  // const [video, setVideo] = useState<File | null>(null);
  const [language, setLanguage] = useState<"EN" | "BN">("EN");

  const userName = user?.name || "Anonymous";
  const { createReport } = useReports();
  const { imagePreview, uploadingImages, handleImageUpload, removeImage } =
    useImageUpload();
  const { divisions, districts, fetchDistricts } = useLocation();

  const {
    values: formData,
    errors,
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
      description: "",
      images: [] as string[],
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
          onSubmit?.(values);
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
          });
          removeImage(0);
        },
        onError: (error) => {
          handleAPIError(error);
        },
      });
    },
  });

  useEffect(() => {
    fetchDistricts(formData.division);
  }, [formData.division, fetchDistricts]);

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

  const handleAIGenerate = async () => {
    const { images, division, district } = formData;
    setIsSubmitting(true);
    const data = await generateReport(
      images || [],
      division,
      district,
      language
    );
    if (data) {
      const { title, description } = data;
      setFormData({
        ...formData,
        title,
        description,
      });
    }
    setIsSubmitting(false);
    return;
  };

  const handleDivisionChange = (value: string) => {
    const selectedDivision = divisions.find(
      (div) => div.division.toLowerCase() === value
    );
    handleChange("division", value);
    handleChange("divisionCoordinates", selectedDivision?.coordinates || "");
    handleChange("district", "");
    handleChange("districtCoordinates", "");
  };

  const handleDistrictChange = (value: string) => {
    const selectedDistrict = districts.find(
      (dist) => dist.district.toLowerCase() === value
    );
    handleChange("district", value);
    handleChange("districtCoordinates", selectedDistrict?.coordinates || "");
  };

  useEffect(() => {
    if (user?._id) {
      setFormData((prevData) => ({
        ...prevData,
        userId: user._id,
      }));
    }
  }, [user, formData.userId]);

  return (
    <div className="flex flex-col mt-4 mx-auto justify-center w-full max-w-screen-md items-center">
      <div className="bg-white w-full rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-border/10">
        <div className="p-5 border-b border-border/10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src={user?.profileImage || "/anticrime-logo.png"}
                alt={userName}
                fill
                sizes="40px"
                priority
                className="rounded-full object-cover ring-2 ring-primary/5"
              />
              {!user?.isVerified && (
                <div className="absolute -top-1 -right-1 bg-destructive/10 text-destructive p-1 rounded-full">
                  <AlertCircle className="w-3 h-3" />
                </div>
              )}
            </div>
            <input
              type="text"
              placeholder={`What crime incident would you like to report, ${userName}?`}
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full border bg-muted/30 hover:bg-muted/50 transition-colors text-gray-800 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="p-5 space-y-4">
          <Textarea
            placeholder="Describe the crime incident in detail..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="min-h-[120px] bg-transparent border-none focus-visible:ring-0 text-[15px] placeholder:text-muted-foreground/60 "
          />

          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 bg-muted/20 hover:bg-muted/30 transition-colors px-3 py-2 rounded-full">
              <MapPin className="w-4 h-4 text-primary/70" />
              <SelectComponent
                selectValue="Select Division"
                value={formData.division}
                onValueChange={handleDivisionChange}
                content={
                  <>
                    {divisions.map((div) => (
                      <SelectItem
                        key={div.division}
                        value={div.division.toLowerCase()}
                      >
                        {div.division}
                      </SelectItem>
                    ))}
                  </>
                }
              />
            </div>

            <div className="flex items-center gap-2 bg-muted/20 hover:bg-muted/30 transition-colors px-3 py-2 rounded-full">
              <MapPin className="w-4 h-4 text-primary/70" />
              <SelectComponent
                selectValue="Select District"
                value={formData.district}
                onValueChange={handleDistrictChange}
                disabled={!formData.division}
                content={
                  <>
                    {districts.map((dist) => (
                      <SelectItem
                        key={dist.district}
                        value={dist.district.toLowerCase()}
                      >
                        {dist.district}
                      </SelectItem>
                    ))}
                  </>
                }
              />
            </div>
          </div>

          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-xl overflow-hidden">
              {imagePreview.map((preview, index) => (
                <div key={preview} className="relative group aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {uploadingImages.has(preview) && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      removeImage(index);
                      handleChange(
                        "images",
                        imagePreview.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/10">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-muted/30 rounded-xl"
                onClick={() => document.getElementById("image-input")?.click()}
              >
                <ImagePlus className="w-5 h-5 mr-2" />
                Photos
              </Button>
              <input
                id="image-input"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="text-muted-foreground hover:bg-muted/30 rounded-xl"
                onClick={() => document.getElementById("video-input")?.click()}
              >
                <VideoIcon className="w-5 h-5 mr-2" />
                Video
              </Button>
              <input
                id="video-input"
                type="file"
                accept="video/*"
                className="hidden"
                // onChange={(e) => {
                //   if (e.target.files?.[0]) {
                //     setVideo(e.target.files[0]);
                //   }
                // }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAIGenerate}
                disabled={
                  isSubmitting ||
                  !formData.images?.length ||
                  !formData.division ||
                  !formData.district
                }
                className="text-primary hover:bg-primary/10 rounded-xl"
              >
                <Sparkles
                  className={`w-5 h-5 mr-2 ${
                    isSubmitting ? "animate-spin" : ""
                  }`}
                />
                AI Generate
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setLanguage((lang) => (lang === "EN" ? "BN" : "EN"))
                }
                className="rounded-full px-4"
              >
                {language}
              </Button>
            </div>

            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 px-6"
              disabled={!formData.description || !formData.images?.length}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReportCard;

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
import { uploadFileToImageBB } from "@/lib/utils";
import axios from "axios";
import { getUser } from "@/redux/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { handleAPIError } from "@/lib/Error";

type Props = {
  onSubmit?: (data: ReportData) => void;
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

interface Division {
  division: string;
  district: string;
  coordinates: string;
}

interface District {
  district: string;
  division: string;
  coordinates: string;
}

interface FieldError {
  field: string;
  message: string;
}

const CreateReportCard = ({ onSubmit }: Props) => {
  const [video, setVideo] = useState<File | null>(null);
  const user = useAppSelector(getUser);
  const userName = user?.name || "Anonymous";

  const [formState, setFormState] = useState({
    divisions: [] as Division[],
    districts: [] as District[],
    imagePreview: [] as string[],
    isLoading: false,
    formData: {
      title: "",
      division: "",
      district: "",
      description: "",
      images: [] as string[],
      crimeTime: new Date(),
      postTime: new Date(),
      userId: user?.id || "",
      divisionCoordinates: "",
      districtCoordinates: "",
    },
    errors: [] as FieldError[],
  });

  // Fetch divisions on component mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const { data } = await axios.get(
          "https://bdapis.com/api/v1.2/divisions"
        );
        setFormState((prev) => ({ ...prev, divisions: data.data }));
      } catch (error) {
        handleAPIError(error);
      }
    };
    fetchDivisions();
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formState.formData.division) return;

      try {
        const { data } = await axios.get(
          `https://bdapis.com/api/v1.2/division/${formState.formData.division}`
        );
        setFormState((prev) => ({ ...prev, districts: data.data }));
      } catch (error) {
        handleAPIError(error);
      }
    };
    fetchDistricts();
  }, [formState.formData.division]);

  // Cleanup function for image previews
  useEffect(() => {
    return () => {
      formState.imagePreview.forEach(URL.revokeObjectURL);
    };
  }, [formState.imagePreview]);

  // Optimized handlers
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const newPreviews = files.map(URL.createObjectURL);

    setFormState((prev) => ({
      ...prev,
      imagePreview: [...prev.imagePreview, ...newPreviews],
    }));

    try {
      const uploadedUrls = await Promise.all(files.map(uploadFileToImageBB));

      setFormState((prev) => ({
        ...prev,
        formData: {
          ...prev.formData,
          images: [...prev.formData.images, ...uploadedUrls],
        },
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      setFormState((prev) => ({
        ...prev,
        imagePreview: prev.imagePreview.slice(
          0,
          prev.imagePreview.length - files.length
        ),
      }));
    }
  };

  const handleAIGenerate = async () => {
    const { formData } = formState;

    const missingFields = [];
    if (!formData.images?.length) missingFields.push("image");
    if (!formData.division) missingFields.push("division");
    if (!formData.district) missingFields.push("district");

    if (missingFields.length > 0) {
      alert(
        `Please provide the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true }));

    try {
      // Get access token from cookies
      const accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        alert("Please login to use AI generation");
        return;
      }

      const { data } = await axios.post(
        "http://localhost:5001/analyze",
        {
          imageUrl: formData.images,
          division: formData.division,
          district: formData.district,
          crime_time: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!data?.report) throw new Error("Invalid response from AI service");

      setFormState((prev) => ({
        ...prev,
        formData: { ...prev.formData, description: data.report },
      }));
      console.log(data);
    } catch (error) {
      handleAPIError(error);
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { formData } = formState;
    const errors: FieldError[] = [];

    if (!formData.title) {
      errors.push({ field: "title", message: "Title is required" });
    }
    if (!formData.division) {
      errors.push({ field: "division", message: "Division is required" });
    }
    if (!formData.district) {
      errors.push({ field: "district", message: "District is required" });
    }
    if (!formData.description) {
      errors.push({ field: "description", message: "Description is required" });
    }
    if (!formData.images?.length) {
      errors.push({
        field: "images",
        message: "At least one image is required",
      });
    }
    if (!formData.userId) {
      errors.push({
        field: "auth",
        message: "Please login to submit a report",
      });
    }

    if (errors.length > 0) {
      setFormState((prev) => ({ ...prev, errors }));
      return;
    }

    try {
      const accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        alert("Please login to submit a report");
        return;
      }

      // Update the form data to include current postTime
      const reportData = {
        ...formState.formData,
        postTime: new Date(),
      };

      const { data } = await axios.post(
        "http://localhost:5001/api/v1/reports",
        reportData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success("Report submitted successfully!");
        onSubmit?.(formState.formData);

        // Clear form after successful submission
        setFormState((prev) => ({
          ...prev,
          formData: {
            title: "",
            division: "",
            district: "",
            description: "",
            images: [],
            crimeTime: new Date(),
            postTime: new Date(),
            userId: user?.id || "",
            divisionCoordinates: "",
            districtCoordinates: "",
          },
          imagePreview: [],
        }));
      }
    } catch (error) {
      handleAPIError(error);
    }
  };
  console.log(formState.divisions, formState.districts);
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-border/40">
      {/* Header Section */}
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <Image
              src="/anticrime-logo.png"
              alt={userName}
              fill
              className="rounded-full object-cover ring-2 ring-primary/10"
            />
            {!user?.isVerified && (
              <div className="absolute -top-1 -right-1 bg-destructive/10 text-destructive p-1 rounded-full">
                <AlertCircle className="w-3 h-3" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{userName}</h3>
            <p className="text-sm text-muted-foreground">
              Share a crime report
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-4">
        {/* Title Input with error state */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Enter report title..."
            value={formState.formData.title}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                formData: { ...prev.formData, title: e.target.value },
                errors: prev.errors.filter((error) => error.field !== "title"),
              }))
            }
            className={`w-full px-4 py-3 rounded-xl border transition-all text-gray-800 bg-gray-50/50 ${
              formState.errors.some((e) => e.field === "title")
                ? "border-destructive focus:ring-destructive/20"
                : "border-gray-200 focus:ring-primary/20 focus:border-primary/30"
            } focus:outline-none focus:ring-2`}
          />
          {formState.errors.map((error, index) => (
            <p
              key={index}
              className="text-sm text-destructive flex items-center gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              {error.message}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-muted-foreground">Description</label>
            <Button
              type="button"
              variant="ghost"
              onClick={handleAIGenerate}
              disabled={
                formState.isLoading ||
                !formState.formData.images?.length ||
                !formState.formData.division ||
                !formState.formData.district
              }
              className="flex items-center gap-2 text-primary hover:bg-primary/10"
            >
              <Sparkles
                className={`w-4 h-4 ${
                  formState.isLoading ? "animate-spin" : ""
                }`}
              />
              <span>AI Generate</span>
            </Button>
          </div>
          <Textarea
            placeholder="Describe the crime incident..."
            value={formState.formData.description}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                formData: { ...prev.formData, description: e.target.value },
              }))
            }
            className="min-h-[120px] bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
          />
        </div>

        {/* Location Selection */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <SelectComponent
              selectValue="Select Division"
              value={formState.formData.division}
              onValueChange={(value) => {
                const selectedDivision = formState.divisions.find(
                  (div) => div.division.toLowerCase() === value
                );
                setFormState((prev) => ({
                  ...prev,
                  formData: {
                    ...prev.formData,
                    division: value,
                    district: "",
                    divisionCoordinates: selectedDivision?.coordinates || "",
                    districtCoordinates: "",
                  },
                }));
              }}
              content={
                <>
                  {formState.divisions.map((div) => (
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

          <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <SelectComponent
              selectValue="Select District"
              value={formState.formData.district}
              onValueChange={(value) => {
                const selectedDistrict = formState.districts.find(
                  (dist) => dist.district.toLowerCase() === value
                );
                setFormState((prev) => ({
                  ...prev,
                  formData: {
                    ...prev.formData,
                    district: value,
                    districtCoordinates: selectedDistrict?.coordinates || "",
                  },
                }));
              }}
              disabled={!formState.formData.division}
              content={
                <>
                  {formState.districts.map((dist) => (
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

        {/* Media Preview Grid */}
        {formState.imagePreview.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {formState.imagePreview.map((preview, index) => (
              <div key={preview} className="relative group aspect-square">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormState((prev) => ({
                      ...prev,
                      imagePreview: prev.imagePreview.filter(
                        (_, i) => i !== index
                      ),
                      formData: {
                        ...prev.formData,
                        images: prev.formData.images.filter(
                          (_, i) => i !== index
                        ),
                      },
                    }));
                  }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary hover:bg-primary/5"
              onClick={() => document.getElementById("image-input")?.click()}
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Add Photos
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
              title="Video is not supported yet"
              disabled
              className="text-muted-foreground hover:text-primary hover:bg-primary/5"
              onClick={() => document.getElementById("video-input")?.click()}
            >
              <VideoIcon className="w-4 h-4 mr-2" />
              Add Video
            </Button>
            <input
              id="video-input"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setVideo(e.target.files[0]);
                }
              }}
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90"
            disabled={
              !formState.formData.description ||
              !formState.formData.images.length
            }
          >
            Post Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateReportCard;

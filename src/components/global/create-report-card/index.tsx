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
import { toast } from "sonner";
import { handleAPIError } from "@/lib/Error";
import { useReports } from "@/hooks/api/useReports";
import { useForm } from "@/hooks";

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

const CreateReportCard = ({ onSubmit, user }: Props) => {
  const [video, setVideo] = useState<File | null>(null);

  const userName = user?.user?.name || "Anonymous";
  const { createReport, generateAiDescription } = useReports();
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState<Set<string>>(
    new Set()
  );

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
      userId: user?.user?._id,
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
            userId: "",
            divisionCoordinates: "",
            districtCoordinates: "",
          });
          setImagePreview([]);
        },
        onError: (error) => {
          handleAPIError(error);
        },
      });
    },
  });

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const { data } = await axios.get(
          "https://bdapis.com/api/v1.2/divisions"
        );
        setDivisions(data.data);
      } catch (error) {
        handleAPIError(error);
      }
    };
    fetchDivisions();
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.division) return;

      try {
        const { data } = await axios.get(
          `https://bdapis.com/api/v1.2/division/${formData.division}`
        );
        setDistricts(data.data);
      } catch (error) {
        handleAPIError(error);
      }
    };
    fetchDistricts();
  }, [formData.division]);

  useEffect(() => {
    return () => {
      imagePreview.forEach(URL.revokeObjectURL);
    };
  }, [imagePreview]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const newPreviews = files.map(URL.createObjectURL);
    setUploadingImages(new Set(newPreviews));
    setImagePreview([...imagePreview, ...newPreviews]);
    try {
      const uploadedUrls = await Promise.all(files.map(uploadFileToImageBB));
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...uploadedUrls],
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      setImagePreview(
        imagePreview.slice(0, imagePreview.length - files.length)
      );
    } finally {
      setUploadingImages(new Set());
    }
  };

  const handleAIGenerate = async () => {
    const { images, division, district } = formData;
    setIsSubmitting(true);
    const data = await generateAiDescription.mutateAsync(
      {
        imageUrl: images || [],
        division,
        district,
        crime_time: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
        },
        onError: (error) => {
          handleAPIError(error);
          setIsSubmitting(false);
        },
      }
    );
    setFormData({ ...formData, description: data.data });
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
    if (user?.user?._id) {
      setFormData((prevData) => ({
        ...prevData,
        userId: user.user._id,
      }));
    }
  }, [user, formData.userId]);

  return (
    <div className="flex justify-center w-full items-center">
      <div className="bg-white w-full max-w-screen-lg  rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-border/40">
        {/* Header Section */}
        <div className="p-4 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12">
              <Image
                src={user?.user?.profileImage || "/anticrime-logo.png"}
                alt={userName}
                fill
                sizes="12px"
                priority
                className="rounded-full object-cover ring-2 ring-primary/10"
              />
              {!user?.user?.isVerified && (
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
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition-all text-gray-800 bg-gray-50/50 ${
                errors.title ? "border-destructive" : "border-gray-200"
              }`}
            />
            {errors.title && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">
                Description
              </label>
              <Button
                type="button"
                variant="ghost"
                onClick={handleAIGenerate}
                disabled={
                  isSubmitting ||
                  !formData.images?.length ||
                  !formData.division ||
                  !formData.district
                }
                className="flex items-center gap-2 text-primary hover:bg-primary/10"
              >
                <Sparkles
                  className={`w-4 h-4 ${isSubmitting ? "animate-spin" : ""}`}
                />
                <span>AI Generate</span>
              </Button>
            </div>
            <Textarea
              placeholder="Describe the crime incident..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-[120px] bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
            />
          </div>

          {/* Location Selection */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
              <MapPin className="w-4 h-4 text-muted-foreground" />
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

            <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-lg">
              <MapPin className="w-4 h-4 text-muted-foreground" />
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

          {/* Media Preview Grid */}
          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {imagePreview.map((preview, index) => (
                <div key={preview} className="relative group aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  {uploadingImages.has(preview) && (
                    <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 relative">
                        <div className="absolute inset-0 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(
                        imagePreview.filter((_, i) => i !== index)
                      );
                      handleChange(
                        "images",
                        imagePreview.filter((_, i) => i !== index)
                      );
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
              disabled={!formData.description || !formData.images?.length}
            >
              Post Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReportCard;

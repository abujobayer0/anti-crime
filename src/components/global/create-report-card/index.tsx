"use client";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { SelectComponent } from "../select-component";
import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { uploadFileToImageBB } from "@/lib/utils";
import axios from "axios";

type Props = {
  onSubmit?: (data: ReportData) => void;
};

interface ReportData {
  title: string;
  division: string;
  district: string;
  description: string;
  images?: string[];
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

const CreateReportCard = ({ onSubmit }: Props) => {
  // Combine related state into a single object
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
    },
  });

  // Memoize API calls
  const fetchDivisions = React.useCallback(async () => {
    try {
      const { data } = await axios.get("https://bdapis.com/api/v1.2/divisions");
      setFormState((prev) => ({ ...prev, divisions: data.data }));
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  }, []);

  const fetchDistricts = React.useCallback(async (division: string) => {
    try {
      const { data } = await axios.get(
        `https://bdapis.com/api/v1.2/division/${division}`
      );
      setFormState((prev) => ({ ...prev, districts: data.data }));
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  }, []);

  // Use single useEffect for API calls
  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  useEffect(() => {
    if (formState.formData.division) {
      fetchDistricts(formState.formData.division);
    }
  }, [formState.formData.division, fetchDistricts]);

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

    if (!formData.images?.length || !formData.division || !formData.district) {
      alert("Please upload an image and select both division and district");
      return;
    }

    setFormState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { data } = await axios.post("http://localhost:5001/analyze", {
        imageUrl: formData.images[0],
        division: formData.division,
        district: formData.district,
        crime_time: new Date(),
      });

      if (!data?.report) throw new Error("Invalid response from AI service");

      setFormState((prev) => ({
        ...prev,
        formData: { ...prev.formData, description: data.report },
      }));
    } catch (error) {
      handleAPIError(error);
    } finally {
      setFormState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formState.formData.title ||
      !formState.formData.division ||
      !formState.formData.district ||
      !formState.formData.description ||
      !formState.formData.images?.length
    ) {
      alert("Please fill in all required fields and upload at least one image");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/reports",
        formState.formData
      );
      onSubmit?.(formState.formData);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full border p-4 rounded-md shadow-sm"
    >
      <div className="flex gap-2 mb-4 justify-end">
        <SelectComponent
          content={
            <SelectGroup>
              <SelectLabel>Division</SelectLabel>
              {formState.divisions &&
                formState.divisions?.map((div) => (
                  <SelectItem key={div.division} value={div.division}>
                    {div.division}
                  </SelectItem>
                ))}
            </SelectGroup>
          }
          selectValue={"Division"}
          onValueChange={(value) =>
            setFormState((prev) => ({
              ...prev,
              formData: { ...prev.formData, division: value },
            }))
          }
        />

        <SelectComponent
          content={
            <SelectGroup>
              <SelectLabel>District</SelectLabel>
              {formState.districts &&
                formState.districts?.map((dist) => (
                  <SelectItem key={dist.district} value={dist.district}>
                    {dist.district}
                  </SelectItem>
                ))}
            </SelectGroup>
          }
          selectValue={"District"}
          onValueChange={(value) =>
            setFormState((prev) => ({
              ...prev,
              formData: { ...prev.formData, district: value },
            }))
          }
        />
      </div>
      <input
        type="text"
        name="title"
        className="w-full border p-2 rounded-md mb-4"
        value={formState.formData.title}
        onChange={(e) =>
          setFormState((prev) => ({
            ...prev,
            formData: { ...prev.formData, title: e.target.value },
          }))
        }
        required
        placeholder="Enter report title..."
      />
      <textarea
        name="description"
        id="description"
        className="w-full h-24 border p-2 rounded-md"
        value={formState.formData.description}
        onChange={(e) =>
          setFormState((prev) => ({
            ...prev,
            formData: { ...prev.formData, description: e.target.value },
          }))
        }
        placeholder="Enter your report description..."
        required
      />

      <div className="flex w-full justify-between items-center mt-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="ghost"
            onClick={handleAIGenerate}
            disabled={formState.isLoading}
          >
            <Sparkles className={formState.isLoading ? "animate-spin" : ""} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="relative flex items-center gap-2"
          >
            <ImageIcon className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageChange}
            />
          </Button>

          {formState.imagePreview.map((preview, index) => (
            <div key={preview} className="relative w-12 h-12">
              <img
                src={preview}
                alt={`Selected image preview ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                onClick={() => {
                  setFormState((prev) => ({
                    ...prev,
                    imagePreview: prev.imagePreview.filter(
                      (_, i) => i !== index
                    ),
                    formData: {
                      ...prev.formData,
                      images:
                        prev.formData.images?.filter((_, i) => i !== index) ||
                        [],
                    },
                  }));
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <Button type="submit">Submit Report</Button>
      </div>
    </form>
  );
};

// Helper function for error handling
const handleAPIError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNREFUSED") {
      alert("Unable to connect to AI service. Please try again later.");
    } else if (error.response?.status === 429) {
      alert("Too many requests. Please wait a moment and try again.");
    } else {
      alert(
        `AI service error: ${
          error.response?.data?.message || "Please try again later"
        }`
      );
    }
  } else {
    alert("Failed to generate description. Please try again.");
  }
};

export default CreateReportCard;

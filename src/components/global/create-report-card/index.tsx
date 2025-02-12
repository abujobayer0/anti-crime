"use client";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { SelectComponent } from "../select-component";
import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import { uploadFileToImageBB } from "@/lib/utils";

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
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [formData, setFormData] = useState<ReportData>({
    title: "",
    division: "",
    district: "",
    description: "",
    images: [],
  });
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await fetch("https://bdapis.com/api/v1.2/divisions");
        const data = await response.json();
        setDivisions(data.data);
      } catch (error) {
        console.error("Error fetching divisions:", error);
      }
    };
    fetchDivisions();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.division) return;
      try {
        const response = await fetch(
          `https://bdapis.com/api/v1.2/division/${formData.division}`
        );
        const data = await response.json();
        setDistricts(data.data);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    fetchDistricts();
  }, [formData.division]);

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);

      // Show preview immediately
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreview((prev) => [...prev, ...newPreviews]);

      // Upload images to ImageBB
      try {
        const uploadedUrls = await Promise.all(
          newFiles.map((file) => uploadFileToImageBB(file))
        );

        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...uploadedUrls],
        }));
      } catch (error) {
        console.error("Error uploading images:", error);
        // Remove previews if upload fails
        setImagePreview((prev) => prev.slice(0, prev.length - newFiles.length));
      }
    }
  };

  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreview]);

  const handleAIGenerate = async () => {
    if (!formData.images?.[0]) {
      alert("Please upload at least one image first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: formData.images[0] }),
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          description: data.description,
        }));
      }
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.division ||
      !formData.district ||
      !formData.description ||
      !formData.images?.length
    ) {
      alert("Please fill in all required fields and upload at least one image");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSubmit?.(formData);
      }
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
              {divisions &&
                divisions?.map((div) => (
                  <SelectItem key={div.division} value={div.division}>
                    {div.division}
                  </SelectItem>
                ))}
            </SelectGroup>
          }
          selectValue={"Division"}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, division: value }))
          }
        />

        <SelectComponent
          content={
            <SelectGroup>
              <SelectLabel>District</SelectLabel>
              {districts &&
                districts?.map((dist) => (
                  <SelectItem key={dist.district} value={dist.district}>
                    {dist.district}
                  </SelectItem>
                ))}
            </SelectGroup>
          }
          selectValue={"District"}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, district: value }))
          }
        />
      </div>
      <input
        type="text"
        name="title"
        className="w-full border p-2 rounded-md mb-4"
        value={formData.title}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, title: e.target.value }))
        }
        required
        placeholder="Enter report title..."
      />
      <textarea
        name="description"
        id="description"
        className="w-full h-24 border p-2 rounded-md"
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
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
            disabled={isLoading}
          >
            <Sparkles className={isLoading ? "animate-spin" : ""} />
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

          {imagePreview.map((preview, index) => (
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
                  setImagePreview((prev) => prev.filter((_, i) => i !== index));
                  setFormData((prev) => ({
                    ...prev,
                    images: prev.images?.filter((_, i) => i !== index) || [],
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

export default CreateReportCard;

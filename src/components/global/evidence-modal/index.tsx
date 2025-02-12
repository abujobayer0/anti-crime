"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, VideoIcon, X, MessageSquare } from "lucide-react";

interface EvidenceModalProps {
  trigger?: React.ReactNode;
  onSubmit: (evidence: {
    description: string;
    images: File[];
    video: File | null;
  }) => void;
}

export const EvidenceModal = ({ trigger, onSubmit }: EvidenceModalProps) => {
  const [evidence, setEvidence] = useState({
    description: "",
    images: [] as File[],
    video: null as File | null,
  });

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "video"
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (type === "images") {
      setEvidence((prev) => ({
        ...prev,
        images: [...prev.images, ...Array.from(files)],
      }));
    } else {
      setEvidence((prev) => ({
        ...prev,
        video: files[0],
      }));
    }
  };

  const removeFile = (type: "images" | "video", index?: number) => {
    if (type === "images" && typeof index === "number") {
      setEvidence((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    } else if (type === "video") {
      setEvidence((prev) => ({
        ...prev,
        video: null,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(evidence);
    setEvidence({ description: "", images: [], video: null }); // Reset form
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <MessageSquare className="h-4 w-4" />
      <span>Add Evidence</span>
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit Evidence</DialogTitle>
        </DialogHeader>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Describe your evidence..."
              value={evidence.description}
              onChange={(e) =>
                setEvidence((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="min-h-[100px]"
            />
          </div>

          {/* Images Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto p-1">
              {evidence.images.map((image, index) => (
                <div key={index} className="relative group aspect-square">
                  <div className="w-full h-full rounded-lg border-2 border-dashed p-1 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Evidence ${index + 1}`}
                      className="object-cover w-full h-full rounded-lg transition-transform duration-200 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                    <button
                      type="button"
                      onClick={() => removeFile("images", index)}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <ImagePlus className="w-6 h-6 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "images")}
                />
              </label>
            </div>
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Video</label>
            {evidence.video ? (
              <div className="relative group">
                <div className="aspect-video rounded-lg border-2 border-dashed p-2 flex items-center justify-center bg-gray-50">
                  <video
                    src={URL.createObjectURL(evidence.video)}
                    className="max-h-full rounded-lg"
                    controls
                  />
                  <button
                    type="button"
                    onClick={() => removeFile("video")}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <label className="aspect-video rounded-lg border-2 border-dashed p-2 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <VideoIcon className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500 mt-2">Add Video</span>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "video")}
                />
              </label>
            )}
          </div>

          <Button type="submit" className="w-full">
            Submit Evidence
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

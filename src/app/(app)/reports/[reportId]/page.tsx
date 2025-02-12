"use client";

import {
  LocateIcon,
  TimerIcon,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import { EvidenceModal } from "@/components/global/evidence-modal";

const dummyData = {
  description:
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ducimus culpatotam illo in quidem dolorum sequi aspernatur ut sunt atque, qui magnitempore quae laborum minima molestiae nisi accusantium harum. Eos cumnam asperiores eum maiores provident esse aut quibusdam omnis dolore nesciunt, veniam consequatur eius qui, ex vero nisi neque nostrum! Ipsam voluptatem est quam ullam magni tempora laborum obcaecati animi suscipit porro praesentium esse ducimus nostrum quo dolorem ea, voluptas tempore delectus eos eligendi atque minus. Porro tempore atque labore ipsum commodi laudantium officiis vitae accusamus libero magnam, id incidunt at nisi quidem impedit. Hic, numquam facere. Doloremque?",
  comments: [
    {
      id: 1,
      comment:
        "I witnessed this incident. The perpetrator was wearing a red jacket.",
      proofImage: "/proof1.jpg",
      proofVideo: null,
      createdAt: "2024-03-15T10:30:00Z",
      user: "Jane Smith",
    },
    {
      id: 2,
      comment: "I have security camera footage from my shop that might help.",
      proofImage: null,
      proofVideo: "/proof-video.mp4",
      createdAt: "2024-03-15T11:45:00Z",
      user: "Mike Johnson",
    },
    {
      id: 3,
      comment: "The police have been notified and are investigating.",
      proofImage: "/police-report.jpg",
      proofVideo: null,
      createdAt: "2024-03-15T13:20:00Z",
      user: "Officer Wilson",
    },
  ],
};

const CrimeReportDetailsPage = () => {
  const [votes, setVotes] = useState({ upvotes: 124, downvotes: 12 });

  const handleEvidenceSubmit = (evidence: {
    description: string;
    images: File[];
    video: File | null;
  }) => {
    // Handle the evidence submission
    console.log("Evidence submitted:", evidence);
    // Add your API call here
  };

  return (
    <div className="container z-[-1] mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content - Left Side */}
        <div className="flex-1 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Image
                src="/anticrime-logo.png"
                alt="User"
                width={48}
                height={48}
                className="rounded-full ring-2 ring-primary/10"
              />
              <div>
                <h2 className="text-lg font-semibold">John Doe</h2>
                <p className="text-sm text-muted-foreground">
                  Posted 2 hours ago
                </p>
              </div>
            </div>

            <h1 className="text-2xl font-bold">Robbery at Local Store</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <LocateIcon size={16} />
                <span>Dhaka Division, Mirpur</span>
              </div>
              <div className="flex items-center gap-2">
                <TimerIcon size={16} />
                <span>Crime Time: Oct 1, 2021 15:30</span>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-gray-700 leading-relaxed">
              {dummyData.description}
            </p>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            {dummyData.comments.slice(0, 4).map((comment, index) => (
              <div
                key={index}
                className={`relative rounded-xl overflow-hidden ${
                  index === 0 ? "col-span-2 aspect-video" : "aspect-square"
                }`}
              >
                <Image
                  src="/card.avif"
                  alt={`Evidence ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>{votes.upvotes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsDown className="w-4 h-4" />
                <span>{votes.downvotes}</span>
              </Button>
            </div>
            <EvidenceModal onSubmit={handleEvidenceSubmit} />
          </div>
        </div>

        {/* Comments Section - Right Side */}
        <div className="lg:w-[380px] space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Evidence & Comments
            </h3>

            <div className="space-y-4">
              {dummyData.comments.map((comment, index) => (
                <div key={index} className="pb-4 border-b last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src="/anticrime-logo.png"
                      alt={comment.user}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{comment.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {comment.comment}
                  </p>
                  {comment.proofImage && (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src="/card.avif"
                        alt="Evidence"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrimeReportDetailsPage;

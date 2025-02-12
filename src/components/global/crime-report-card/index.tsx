"use client";
import Image from "next/image";
import React, { useState } from "react";
import { GlobalPopover } from "../global-popover";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  EllipsisVertical,
  LocateIcon,
  Siren,
  TimerIcon,
} from "lucide-react";
import Link from "next/link";

interface User {
  _id: string;
  name: string;
  profileImage: string;
  isVerified: boolean;
  // Add other user fields as needed
}

interface CrimeReport {
  _id: string;
  userId: User;
  title: string;
  description: string;
  images: string[];
  division: string;
  district: string;
  crimeTime: string;
  upvotes: string[];
  downvotes: string[];
  comments: any[]; // Type this properly based on your comment structure
}

interface Props {
  report: CrimeReport;
}

const CrimeReportCard = ({ report }: Props) => {
  const [collapsedDescription, setCollapsedDescription] = useState(false);
  const [collapsedComments, setCollapsedComments] = useState(false);
  const [votes, setVotes] = useState({
    upvotes: report.upvotes.length,
    downvotes: report.downvotes.length,
  });
  const [showCommentForm, setShowCommentForm] = useState(false);
  // const [comments, setComments] = useState(reports.comments || []);
  const [commentForm, setCommentForm] = useState({
    comment: "",
    proofImage: null,
    proofVideo: null,
  });

  const description =
    report?.description?.length > 300 && !collapsedDescription
      ? report.description.slice(0, 300)
      : report?.description;

  const handleSubmitProof = () => {
    // Implementation of handleSubmitProof function
  };

  return (
    <div className="flex flex-col w-full  max-w-2xl mx-auto border rounded-md shadow-sm bg-white transition-all">
      <div className="flex items-center justify-between p-4 md:p-6 border-b">
        <div className="flex items-center gap-3">
          <Image
            src={report?.userId?.profileImage}
            alt="user"
            width={40}
            height={40}
            className="rounded-full border-2 border-blue-500 hover:scale-105 transition-transform"
          />
          <div>
            <div className="font-semibold">{report?.userId?.name}</div>
            <div className="text-sm text-gray-500">
              {report?.userId?.isVerified ? "Verified User" : "User"}
            </div>
          </div>
          {report?.userId?.isVerified && (
            <div className="py-1 px-2 flex items-center text-xs gap-1 bg-green-400/20 text-green-700 rounded-xl">
              Verified
              <CheckCircle size={12} />
            </div>
          )}
        </div>
        <GlobalPopover
          align="end"
          action={
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <EllipsisVertical />
            </Button>
          }
          content={
            <Button
              variant="ghost"
              className="flex justify-start text-sm gap-2 text-red-600 hover:text-red-700  hover:bg-red-50"
            >
              <Siren size={16} /> Emergency Contact
            </Button>
          }
        />
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col  justify-between gap-2">
          <Link
            href={`/reports/${report._id}`}
            className="text-xl font-bold w-full hover:underline"
          >
            {report?.title}
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <LocateIcon size={12} />
            <span>
              {report?.division}, {report?.district}
            </span>
          </div>
          <div className="flex items-center text-sm gap-2">
            <TimerIcon size={12} />
            <span>
              Crime Time: {new Date(report?.crimeTime).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-gray-700">{description}</p>
          <button
            className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            onClick={() => setCollapsedDescription((prev) => !prev)}
          >
            {collapsedDescription ? "Show less" : "Show more"}
          </button>
        </div>
        <div className="w-full grid grid-cols-2 gap-2 container ">
          {report?.images?.map((image: string, j: number) => (
            <div key={j} className="relative w-full overflow-hidden">
              <img
                src={image}
                alt="crime scene"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-4">
            <button
              className="flex items-center space-x-2 transition-colors duration-200"
              onClick={() =>
                setVotes((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }))
              }
            >
              <div
                className={`p-2 rounded-full hover:bg-green-100 ${
                  votes.upvotes > 0 ? "text-green-500" : "text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </div>
              <span className="font-medium">{votes.upvotes}</span>
            </button>
            <button
              className="flex items-center space-x-2 transition-colors duration-200"
              onClick={() =>
                setVotes((prev) => ({ ...prev, downvotes: prev.downvotes + 1 }))
              }
            >
              <div
                className={`p-2 rounded-full hover:bg-red-100 ${
                  votes.downvotes > 0 ? "text-red-500" : "text-gray-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5 6h2a2 2 0 002-2v-6a2 2 0 00-2-2h-2.5"
                  />
                </svg>
              </div>
              <span className="font-medium">{votes.downvotes}</span>
            </button>
          </div>

          <button
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            onClick={() => setShowCommentForm((prev) => !prev)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <span className="hidden sm:inline">Add Proof</span>
          </button>
        </div>

        {showCommentForm && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
            <textarea
              className="w-full p-3 border rounded-xl mb-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              placeholder="Add your comment with proof..."
              rows={4}
              value={commentForm.comment}
              onChange={(e) =>
                setCommentForm((prev) => ({ ...prev, comment: e.target.value }))
              }
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
                <span>Attach Files</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file?.type.startsWith("image/")) {
                      setCommentForm((prev: any) => ({
                        ...prev,
                        proofImage: file,
                      }));
                    } else if (file?.type.startsWith("video/")) {
                      setCommentForm((prev: any) => ({
                        ...prev,
                        proofVideo: file,
                      }));
                    }
                  }}
                />
              </label>
              <button
                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                onClick={handleSubmitProof}
              >
                Submit Proof
              </button>
            </div>
          </div>
        )}
      </div>

      {/* {!collapsedComments && (
        <div
          onClick={() => setCollapsedComments(true)}
          className="p-4 border-t cursor-pointer"
        >
          show comments <strong>{comments.length}</strong>
        </div>
      )}
      {collapsedComments && (
        <div className="mt-4 space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="border-t p-4">
              <div className="flex items-center mb-2">
                <Image
                  src={"/anticrime-logo.png"}
                  alt="user"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="ml-2 font-medium">User</span>
                <span className="ml-2 text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{comment.comment}</p>
              {comment.proofImage && (
                <img
                  // src={comment.proofImage}
                  src={"/card.avif"}
                  alt="proof"
                  className="max-w-xs rounded-lg mb-2"
                />
              )}
              {comment.proofVideo && (
                <video controls className="max-w-xs rounded-lg mb-2">
                  <source
                    //  src={comment.proofVideo}
                    src="/video.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          ))}{" "}
          {collapsedComments && (
            <div
              onClick={() => setCollapsedComments(false)}
              className="p-4 border-t cursor-pointer"
            >
              hide comments
            </div>
          )}
        </div>
      )} */}
    </div>
  );
};
export default CrimeReportCard;

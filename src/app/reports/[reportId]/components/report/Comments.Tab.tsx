import { CommentsSection } from "@/components/global/comments-section";
import { CrimeReport, User } from "@/components/global/crime-report-card/types";
import { MessageSquare } from "lucide-react";
import React from "react";

const CommentsTab = ({ report, user }: { report: CrimeReport; user: User }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-6 pb-3 border-b flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <span>Comments & Evidence</span>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full ml-2">
          {report.comments.length}
        </span>
      </h3>
      <CommentsSection
        comments={report.comments}
        reportId={report._id}
        sessionUser={user}
        userImage={user?.profileImage}
        open={true}
      />
    </div>
  );
};

export default CommentsTab;

import { AlertTriangle, ArrowRight } from "lucide-react";
import type {
  CrimeReport,
  User as UserType,
} from "../../../../components/global/crime-report-card/types";

import { useReports } from "@/hooks";
import Link from "next/link";
import { useState } from "react";
import Hero from "./report/Hero";
import TabNavigator from "./report/Tab.Navigator";
import DetailsTab from "./report/Details.Tab";
import CommentsTab from "./report/Comments.Tab";
import CrimeStatistics from "./widgets/Crime.Statistics";
import SimilarReports from "./SimilarReports/Similar.Reports";

interface ViewProps {
  report: CrimeReport;
  user: UserType;
  relatedReports: CrimeReport[];
}

export const ReportDetailsView = ({
  report,
  user,
  relatedReports = [],
}: ViewProps) => {
  const { voteReport } = useReports();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("details"); // "details" or "comments"

  const handleVote = (props: { id: string; type: "upvote" | "downvote" }) => {
    voteReport.mutate(props);
  };

  const primaryImage = report?.images?.[0] || "";

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <Hero
        report={report}
        user={user}
        primaryImage={primaryImage}
        handleVote={({ id, type }) => handleVote({ id, type })}
      />

      <div className="container mx-auto px-4 mt-20 pt-6">
        <TabNavigator
          report={report}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === "details" ? (
              <DetailsTab
                report={report}
                activeImageIndex={activeImageIndex}
                setActiveImageIndex={setActiveImageIndex}
              />
            ) : (
              <CommentsTab report={report} user={user} />
            )}
          </div>

          <div className="space-y-6">
            <CrimeStatistics report={report} />
          </div>
        </div>
      </div>

      {/* Related Reports Section */}
      <div className="container mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Similar Reports
          </h2>
          <Link
            href="/hot/reports"
            className="text-primary flex items-center gap-1 font-medium hover:underline"
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <SimilarReports relatedReport={relatedReports} />
      </div>
    </div>
  );
};

"use client";

import Image from "next/image";
import { Trash2, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useReports } from "@/hooks";

const ReportTable = ({ searchQuery }: { searchQuery: string }) => {
  const { getReports, deleteReport } = useReports();
  const { data: reports, isLoading } = getReports;
  const { toast } = useToast();

  const filteredReports = reports?.data?.filter(
    (report: any) =>
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.userId.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveReport = async (reportId: string) => {
    try {
      await deleteReport.mutateAsync(reportId);
      toast({
        title: "Report Removed",
        description: "The report has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove report.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    // switch (is.toLowerCase()) {
    //   case "open":
    //     return "bg-yellow-500 hover:bg-yellow-600";
    //   case "in progress":
    //     return "bg-blue-500 hover:bg-blue-600";
    //   case "closed":
    //     return "bg-green-500 hover:bg-green-600";
    //   default:
    //     return "bg-gray-500 hover:bg-gray-600";
    // }
  };

  if (isLoading) {
    return <div className="text-center text-lg text-gray-500">Loading...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filteredReports?.map((report: any) => (
        <Card
          key={report._id}
          className="transition-all  cursor-pointer transform hover:scale-105 hover:shadow-xl rounded-2xl overflow-hidden bg-white border border-gray-200"
        >
          <CardHeader className="p-0">
            <div className="relative h-48 w-full">
              <Image
                src={report.images[0] || "/placeholder.svg"}
                alt={report.title}
                fill
                className="object-cover rounded-t-2xl"
              />
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {report.title}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {report.description.length > 100
                ? `${report.description.substring(0, 100)}...`
                : report.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                {report.upvotes.length}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsDown className="h-4 w-4 text-red-500" />
                {report.downvotes.length}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                {report.comments.length}
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-4 flex justify-between items-center border-t border-gray-200">
            <Badge
              className={`px-3 py-1 rounded-full text-white ${getStatusColor(
                report.status
              )}`}
            >
              {report.status}
            </Badge>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {report.userId.email}
              </span>
              <Button
                variant="destructive"
                size="sm"
                className="transition-all duration-300 hover:bg-red-700"
                onClick={() => handleRemoveReport(report._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
export default ReportTable;

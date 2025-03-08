import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import {
  MapPin,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Clock,
  AlertTriangle,
  ChevronRight,
  Share2,
} from "lucide-react";
import { CrimeReport } from "@/components/global/crime-report-card/types";

export default function CrimeCard({ report }: { report: CrimeReport }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(report.postTime), {
    addSuffix: true,
  });

  // Calculate engagement metrics
  const upvoteCount = report.upvotes?.length || 0;
  const downvoteCount = report.downvotes?.length || 0;
  const commentCount = report.comments?.length || 0;

  // Get first 120 characters of description for preview
  const previewDescription =
    report.description.length > 120
      ? `${report.description.substring(0, 120)}...`
      : report.description;

  // Navigate to report detail page
  const navigateToDetail = () => {
    router.push(`/reports/${report._id}`);
  };

  // Handle severity color
  const getSeverityColor = () => {
    const score = report.algorithmScore || 0;
    if (score >= 7) return "bg-red-600";
    if (score >= 5) return "bg-orange-500";
    return "bg-blue-600";
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card Header with Image */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={report.images[0]}
          alt={report.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ${
            isHovered ? "scale-105" : ""
          }`}
        />

        {/* Overlay gradient */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pb-6">
          <div className="flex items-center text-white mb-1">
            <MapPin size={14} className="mr-1 text-blue-300" />
            <span className="text-sm font-medium capitalize">
              {report.district}, {report.division}
            </span>
          </div>
          <h3 className="font-bold text-lg text-white">{report.title}</h3>
        </div>

        {/* Algorithm Score Badge */}
        <div
          className={`absolute top-3 right-3 ${getSeverityColor()} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center`}
        >
          <AlertTriangle size={12} className="mr-1" />
          Score: {report?.algorithmScore?.toFixed(1)}
        </div>

        {/* Time Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
          <Clock size={12} className="mr-1" />
          {formattedDate}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Author info */}
        <div className="flex items-center mb-3">
          <div className="h-9 w-9 rounded-full overflow-hidden relative mr-2 border-2 border-gray-100">
            <Image
              src={report.userId.profileImage}
              alt={report.userId.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">{report.userId.name}</p>
            <p className="text-xs text-gray-500">Reported {formattedDate}</p>
          </div>
        </div>

        {/* Description preview */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {previewDescription}
        </p>

        {/* Engagement metrics and actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex space-x-5">
            <div className="flex items-center text-gray-600">
              <ThumbsUp size={16} className="mr-1.5 text-blue-600" />
              <span className="text-sm font-medium">{upvoteCount}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <ThumbsDown size={16} className="mr-1.5 text-orange-500" />
              <span className="text-sm font-medium">{downvoteCount}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MessageCircle size={16} className="mr-1.5 text-green-600" />
              <span className="text-sm font-medium">{commentCount}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="text-gray-400 hover:text-blue-600 transition-colors"
              aria-label="Share report"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={navigateToDetail}
              className={`${
                isHovered
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              } py-1.5 px-3 rounded-full text-xs font-medium flex items-center transition-colors duration-300`}
            >
              View Details
              <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

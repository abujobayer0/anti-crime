import { Skeleton } from "@/components/ui/skeleton";
import { LocateIcon, TimerIcon, MessageSquare } from "lucide-react";

export const ReportDetailsSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-6 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="w-32 h-5" />
                <Skeleton className="w-24 h-4 mt-1" />
              </div>
            </div>

            <Skeleton className="w-3/4 h-6 mt-4" />

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <LocateIcon size={16} />
                <Skeleton className="w-40 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <TimerIcon size={16} />
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <Skeleton className="w-full h-24" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <Skeleton
                key={index}
                className={`rounded-xl overflow-hidden ${
                  index === 0 ? "col-span-2 aspect-video" : "aspect-square"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="w-full lg:max-w-xl space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <Skeleton className="w-40 h-5" />
            </h3>
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} className="w-full h-12" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

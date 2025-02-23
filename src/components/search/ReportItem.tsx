import { format } from "date-fns";
import { CommandItem } from "../ui/command";
import { Report } from "@/types";

const ReportItem = ({
  item,
  onSelect,
}: {
  item: any;
  onSelect: (item: Report) => void;
}) => {
  return (
    <CommandItem
      key={item._id}
      className="flex cursor-pointer items-center gap-3 p-3"
      onSelect={() => onSelect({ ...item, type: "report" })}
    >
      <div className="flex items-center gap-3 flex-1">
        <img
          src={item.images?.[0] || "https://via.placeholder.com/64"}
          alt={item.title || "No Title"}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h1 className="font-medium line-clamp-1">{item.title}</h1>
          <article className="text-sm line-clamp-2 text-muted-foreground">
            {item.description}
          </article>
          <div className="text-xs text-muted-foreground mt-1">
            {item.postTime
              ? format(new Date(item.postTime), "MMM dd, yyyy")
              : "Unknown Date"}
          </div>
        </div>
      </div>
    </CommandItem>
  );
};

export default ReportItem;

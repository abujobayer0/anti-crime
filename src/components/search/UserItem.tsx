import { CommandItem } from "../ui/command";
import { FollowButton } from "../ui/follow-button";
import { Report } from "@/types";
const UserItem = ({
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
      onSelect={() => onSelect({ ...item, type: "user" })}
    >
      <img
        src={item.profileImage || "https://via.placeholder.com/48"}
        alt={item.name || "Unknown User"}
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="flex-1">
        <h1 className="font-medium">{item.name}</h1>
        <p className="text-sm text-muted-foreground">{item.email}</p>
      </div>
      <FollowButton isFollowing={item.isFollowing} className="h-8 px-3" />
    </CommandItem>
  );
};

export default UserItem;

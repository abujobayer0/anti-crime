import { AlertCircleIcon, BarChart2 } from "lucide-react";
import { CommandGroup, CommandItem } from "../ui/command";

const QuickActions = () => {
  return (
    <CommandGroup heading="Quick Actions">
      <CommandItem>
        <AlertCircleIcon className="mr-2 h-4 w-4" />
        <span>Create New Report</span>
      </CommandItem>
      <CommandItem>
        <BarChart2 className="mr-2 h-4 w-4" />
        <span>View Statistics</span>
      </CommandItem>
    </CommandGroup>
  );
};
export default QuickActions;

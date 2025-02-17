import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverContentProps } from "@radix-ui/react-popover";
interface Props {
  action: React.ReactNode;
  content: React.ReactNode;
  align?: PopoverContentProps["align"];
}
export function GlobalPopover({ action, content, align }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>{action}</PopoverTrigger>
      <PopoverContent align={align} className="w-54 p-2" sideOffset={5}>
        {content}
      </PopoverContent>
    </Popover>
  );
}

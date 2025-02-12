import * as React from "react";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  selectValue: string;
  content: React.ReactNode;
}

export function SelectComponent({ selectValue, content }: Props) {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={selectValue} />
      </SelectTrigger>
      <SelectContent>{content}</SelectContent>
    </Select>
  );
}

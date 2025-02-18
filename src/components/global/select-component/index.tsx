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
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export function SelectComponent({
  selectValue,
  content,
  value,
  onValueChange,
  disabled = false,
}: Props) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={selectValue} />
      </SelectTrigger>
      <SelectContent>{content}</SelectContent>
    </Select>
  );
}

import { useSearch } from "@/hooks/useSearch";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";

import { Report } from "@/types";
import QuickActions from "./QuickActions";
import UserItem from "./UserItem";
import ReportItem from "./ReportItem";
import SearchInput from "./SearchInput";

interface SearchCommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: Report) => void;
  query: string;
  setQuery: (query: string) => void;
}

export function SearchCommandMenu({
  open,
  onOpenChange,
  onSelect,
  query,
  setQuery,
}: SearchCommandMenuProps) {
  const { results, isLoading } = useSearch(query);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <SearchInput query={query} setQuery={setQuery} />
      <CommandList className="max-h-[500px] overflow-auto border border-gray-300">
        {isLoading && <CommandEmpty>Searching...</CommandEmpty>}
        {!isLoading && results.length === 0 && (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {!isLoading && results.length > 0 && (
          <CommandGroup heading="Results">
            {results.map((result) => {
              if (!result?.data) return null;
              return result.type === "report" ? (
                <ReportItem
                  key={result.data._id}
                  item={result.data}
                  onSelect={onSelect}
                />
              ) : result.type === "user" ? (
                <UserItem
                  key={result.data._id}
                  item={result.data}
                  onSelect={onSelect}
                />
              ) : null;
            })}
          </CommandGroup>
        )}
        <QuickActions />
      </CommandList>
    </CommandDialog>
  );
}

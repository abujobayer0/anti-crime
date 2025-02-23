import { Input } from "../ui/input";

const SearchInput = ({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (query: string) => void;
}) => {
  return (
    <div className="flex items-center border-b px-3">
      <Input
        placeholder="Search reports, users, locations..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none px-0 h-11"
      />
    </div>
  );
};

export default SearchInput;

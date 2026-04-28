import { forwardRef } from "react";
import { Stack, Text, Button } from "../ui-stub";

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  onClear: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ value, onChange, onClear }, ref) {
    return (
      <Stack direction="row" gap={2} align="center">
        <label htmlFor="search-input">
          <Text as="span" size="md">Search</Text>
        </label>
        <input
          id="search-input"
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="field"
          aria-label="Search projects by title or description"
          placeholder="Type to filter..."
        />
        {value && (
          <Button onClick={onClear} aria-label="Clear search input">Clear</Button>
        )}
      </Stack>
    );
  },
);

import { Stack, Button, Text } from "../ui-stub";

interface TagFilterProps {
  tags: string[];
  selected: string[];
  onChange: (tags: string[]) => void;
}

export function TagFilter({ tags, selected, onChange }: TagFilterProps) {
  const toggle = (tag: string) => {
    onChange(
      selected.includes(tag) ? selected.filter((t) => t !== tag) : [...selected, tag],
    );
  };

  return (
    <Stack
      direction="row"
      gap={1}
      align="center"
      role="group"
      aria-labelledby="tag-filter-label"
    >
      <Text as="span" id="tag-filter-label" size="md">Tags</Text>
      {tags.map((tag) => {
        const active = selected.includes(tag);
        return (
          <Button
            key={tag}
            onClick={() => toggle(tag)}
            aria-pressed={active}
            variant={active ? "primary" : "ghost"}
          >
            {tag}
          </Button>
        );
      })}
    </Stack>
  );
}

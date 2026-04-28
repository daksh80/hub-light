import { Stack, Text } from "../ui-stub";

interface TagListProps {
  tags: string[];
}

export function TagList({ tags }: TagListProps) {
  if (tags.length === 0) return null;
  return (
    <Stack direction="row" gap={1} className="tag-list">
      {tags.map((tag) => (
        <Text as="span" key={tag} size="xs" className="tag-badge">
          {tag}
        </Text>
      ))}
    </Stack>
  );
}

import { useEffect, useRef } from "react";
import { Stack, Text, Card, Button } from "../ui-stub";
import { Project } from "../schemas/projectSchema";
import { TagList } from "./TagList";
import { formatDate } from "../utils/strings";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const detailRef = useRef<HTMLDivElement>(null);

  // Pull keyboard focus into the panel when a new project is opened.
  useEffect(() => {
    detailRef.current?.focus();
  }, [project.id]);

  const fields = [
    { label: "Status:", value: project.status },
    { label: "Owner:", value: project.owner },
    { label: "Updated:", value: formatDate(project.updatedAt) },
  ];

  return (
    <Card
      ref={detailRef}
      tabIndex={-1}
      role="region"
      aria-label="Project detail"
      aria-live="polite"
      className="project-detail"
    >
      <Stack direction="column" gap={2}>
        <Stack direction="row" gap={2} align="center" justify="space-between">
          <Text as="h2" size="xl">{project.title}</Text>
          <Button onClick={onClose} aria-label="Close detail panel">Close</Button>
        </Stack>

        <Stack direction="column" gap={1}>
          {fields.map(({ label, value }) => (
            <Text as="span" size="sm" key={label}>{label} {value}</Text>
          ))}
        </Stack>

        <Text as="p" size="md">{project.description}</Text>

        {project.tags.length > 0 && (
          <Stack direction="column" gap={1}>
            <Text as="span" size="sm" className="detail-label">Tags</Text>
            <TagList tags={project.tags} />
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

import type { KeyboardEvent } from "react";
import { Card, Stack, Text } from "../ui-stub";
import { Project } from "../schemas/projectSchema";
import { TagList } from "./TagList";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  selected?: boolean;
}

export function ProjectCard({ project, onClick, selected }: ProjectCardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`project-card${selected ? " project-card--selected" : ""}`}
      tabIndex={0}
      role="button"
      aria-current={selected ? "true" : undefined}
      aria-label={`Open ${project.title}`}
    >
      <Stack direction="column" gap={2}>
        <Text as="h3" size="lg">{project.title}</Text>
        <Text as="span" size="sm">Status: {project.status}</Text>
        <TagList tags={project.tags} />
      </Stack>
    </Card>
  );
}

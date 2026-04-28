export const projectStatuses = ["active", "paused", "archived"] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export type Project = {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  owner: string;
  updatedAt: string;
  tags: string[];
};

function isProjectStatus(value: unknown): value is ProjectStatus {
  return typeof value === "string" && projectStatuses.includes(value as ProjectStatus);
}

function isProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") return false;

  const project = value as Record<string, unknown>;
  return (
    typeof project.id === "string" &&
    typeof project.title === "string" &&
    typeof project.description === "string" &&
    isProjectStatus(project.status) &&
    typeof project.owner === "string" &&
    typeof project.updatedAt === "string" &&
    Array.isArray(project.tags) &&
    project.tags.every((tag) => typeof tag === "string")
  );
}

export function parseProjects(value: unknown): Project[] {
  if (!Array.isArray(value) || !value.every(isProject)) {
    throw new Error("Project data is not in the expected shape");
  }

  return value;
}

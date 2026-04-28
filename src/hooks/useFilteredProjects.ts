import { useMemo } from "react";
import { Project, ProjectStatus } from "../schemas/projectSchema";

export interface FilterOptions {
  search: string;
  status: ProjectStatus | "all";
  tags: string[];
}

export function useFilteredProjects(
  projects: Project[] | null,
  { search, status, tags }: FilterOptions,
): Project[] {
  return useMemo(() => {
    if (!projects) return [];
    const needle = search.toLowerCase();

    return projects.filter((p) => {
      if (needle && !p.title.toLowerCase().includes(needle) && !p.description.toLowerCase().includes(needle)) {
        return false;
      }
      if (status !== "all" && p.status !== status) return false;
      if (tags.length && !tags.every((t) => p.tags.includes(t))) return false;
      return true;
    });
  }, [projects, search, status, tags]);
}

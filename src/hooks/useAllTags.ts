import { useMemo } from "react";
import { Project } from "../schemas/projectSchema";

export function useAllTags(projects: Project[] | null): string[] {
  return useMemo(() => {
    if (!projects) return [];
    const tags = new Set<string>();
    for (const p of projects) for (const t of p.tags) tags.add(t);
    return [...tags].sort();
  }, [projects]);
}

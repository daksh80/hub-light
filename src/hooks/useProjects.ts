import { useEffect, useRef, useState } from "react";
import { parseProjects, Project } from "../schemas/projectSchema";

export interface UseProjectsOptions {
  simulateError?: boolean;
  simulateDelay?: number;
}

export function useProjects({
  simulateError = false,
  simulateDelay = 800,
}: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setProjects(null);

    const id = ++requestId.current;
    const isStale = () => requestId.current !== id;

    (async () => {
      try {
        await new Promise((r) => setTimeout(r, simulateDelay));
        if (isStale()) return;
        if (simulateError) throw new Error("Failed to fetch projects");
        const data = await import("../data/projects.json");
        if (isStale()) return;
        setProjects(parseProjects(data.default ?? data));
        setLoading(false);
      } catch (e) {
        if (isStale()) return;
        setError(e instanceof Error ? e.message : "Unknown error");
        setLoading(false);
      }
    })();

    return () => {
      requestId.current++;
    };
  }, [simulateError, simulateDelay]);

  return { projects, error, loading };
}

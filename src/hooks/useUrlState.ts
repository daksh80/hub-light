import { useEffect, useState } from "react";
import { ProjectStatus, projectStatuses } from "../schemas/projectSchema";

export interface UrlFilterState {
  q: string;
  status: ProjectStatus | "all";
  tags: string[];
  selected: string;
}

function isStatus(v: string | null): v is ProjectStatus {
  return v !== null && (projectStatuses as readonly string[]).includes(v);
}

export function parseUrlParams(): UrlFilterState {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  return {
    q: params.get("q") ?? "",
    status: isStatus(status) ? status : "all",
    tags: params.getAll("tag"),
    selected: params.get("selected") ?? "",
  };
}

export function useUrlState(initial: UrlFilterState) {
  const [state, setState] = useState<UrlFilterState>(initial);

  useEffect(() => {
    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.status !== "all") params.set("status", state.status);
    state.tags.forEach((tag) => params.append("tag", tag));
    if (state.selected) params.set("selected", state.selected);

    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [state]);

  return [state, setState] as const;
}

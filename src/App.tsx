import { useEffect, useRef, useState } from "react";
import { Stack, Text, Button } from "@/ui-stub";
import {
  useProjects,
  useUrlState,
  parseUrlParams,
  useDebouncedValue,
  useFilteredProjects,
  useAllTags,
} from "./hooks";
import { ProjectList } from "./components/ProjectList";
import { ProjectDetail } from "./components/ProjectDetail";
import { SearchBar } from "./components/SearchBar";
import { StatusFilter } from "./components/StatusFilter";
import { TagFilter } from "./components/TagFilter";
import { CopyLinkButton } from "./components/CopyLinkButton";
import "./App.css";

const SEARCH_DEBOUNCE_MS = 300;

export default function App() {
  const [state, setState] = useUrlState(parseUrlParams());
  const [simulateError, setSimulateError] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { projects, loading, error } = useProjects({ simulateError });
  const allTags = useAllTags(projects);
  const debouncedSearch = useDebouncedValue(state.q, SEARCH_DEBOUNCE_MS);

  const filtered = useFilteredProjects(projects, {
    search: debouncedSearch,
    status: state.status,
    tags: state.tags,
  });
  useEffect(() => {
    if (!projects || !state.selected) return;
    if (!filtered.some((p) => p.id === state.selected)) {
      setState((prev) => ({ ...prev, selected: "" }));
    }
  }, [projects, filtered, state.selected, setState]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const inField = (e.target as HTMLElement | null)?.tagName === "INPUT";
      if (e.key === "/" && !inField) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === "Escape") {
        setState((prev) => (prev.selected ? { ...prev, selected: "" } : prev));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setState]);

  const selectedProject = state.selected
    ? filtered.find((p) => p.id === state.selected)
    : undefined;

  const clearFilters = () =>
    setState((prev) => ({ ...prev, q: "", status: "all", tags: [] }));

  return (
    <div className="app-shell">
      <main aria-labelledby="app-title">
        <Text as="h1" id="app-title" tone="title">Project Hub Lite</Text>

        <Stack direction="row" gap={2} align="center" className="toolbar">
          <SearchBar
            ref={searchInputRef}
            value={state.q}
            onChange={(q) => setState((prev) => ({ ...prev, q }))}
            onClear={() => setState((prev) => ({ ...prev, q: "" }))}
          />
          <StatusFilter
            value={state.status}
            onChange={(status) => setState((prev) => ({ ...prev, status }))}
          />
          <TagFilter
            tags={allTags}
            selected={state.tags}
            onChange={(tags) => setState((prev) => ({ ...prev, tags }))}
          />
          <Button variant="ghost" onClick={clearFilters} aria-label="Clear all filters">
            Clear Filters
          </Button>
          <Button
            variant="ghost"
            onClick={() => setSimulateError(true)}
            aria-label="Simulate project loading error"
          >
            Simulate Error
          </Button>
          <CopyLinkButton />
        </Stack>

        {loading && <Text as="p">Loading projects…</Text>}

        {error && (
          <Stack direction="column" gap={2} role="alert">
            <Text as="p" tone="danger">{error}</Text>
            <Button onClick={() => setSimulateError(false)}>Retry</Button>
          </Stack>
        )}

        {!loading && !error && filtered.length === 0 && (
          <Text as="p">No projects match your filters.</Text>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="results">
            <ProjectList
              projects={filtered}
              onSelect={(id) => setState((prev) => ({ ...prev, selected: id }))}
              selectedId={state.selected}
            />
            {selectedProject && (
              <ProjectDetail
                project={selectedProject}
                onClose={() => setState((prev) => ({ ...prev, selected: "" }))}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

import { act, fireEvent, render, screen, within } from "@testing-library/react";
import App from "./App";
import projectsData from "./data/projects.json";

void projectsData;

async function finishProjectLoad() {
  act(() => {
    vi.advanceTimersByTime(800);
  });
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("App", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.history.replaceState(null, "", "/");
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("debounces text search before narrowing the project list", async () => {
    render(<App />);
    await finishProjectLoad();

    expect(screen.getByText("Advertising Campaign Console")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "legacy" } });

    expect(screen.getByText("Advertising Campaign Console")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(screen.getByText("Legacy CSV Import")).toBeInTheDocument();
    expect(screen.queryByText("Advertising Campaign Console")).not.toBeInTheDocument();
    expect(window.location.search).toContain("q=legacy");
  });

  it("restores filters and selected project from the URL and focuses the detail region", async () => {
    window.history.replaceState(null, "", "/?status=active&tag=video&selected=clips-editor");

    render(<App />);
    await finishProjectLoad();

    expect(screen.getAllByText("Short-form Clips Editor").length).toBeGreaterThan(0);
    expect(screen.queryByText("Advertising Campaign Console")).not.toBeInTheDocument();

    const detail = screen.getByRole("region", { name: "Project detail" });
    expect(within(detail).getByText("Owner: Team Byte")).toBeInTheDocument();
    expect(detail).toHaveFocus();
  });

  it("shows an empty state when combined filters have no matches", async () => {
    render(<App />);
    await finishProjectLoad();

    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "not a real project" } });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(screen.getByText("No projects match your filters.")).toBeInTheDocument();
  });

  it("shows a simulated loading error and recovers on retry", async () => {
    render(<App />);
    await finishProjectLoad();

    fireEvent.click(screen.getByRole("button", { name: "Simulate project loading error" }));
    expect(screen.getByText("Loading projects…")).toBeInTheDocument();

    await finishProjectLoad();

    expect(screen.getByRole("alert")).toHaveTextContent("Failed to fetch projects");

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    await finishProjectLoad();

    expect(screen.getByText("Portfolio Audit Log")).toBeInTheDocument();
  });
});

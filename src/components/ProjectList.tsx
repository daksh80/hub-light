import { Project } from "../schemas/projectSchema";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  onSelect: (id: string) => void;
  selectedId?: string;
}

export function ProjectList({ projects, onSelect, selectedId }: ProjectListProps) {
  return (
    <ul className="project-list" role="list">
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard
            project={project}
            onClick={() => onSelect(project.id)}
            selected={selectedId === project.id}
          />
        </li>
      ))}
    </ul>
  );
}

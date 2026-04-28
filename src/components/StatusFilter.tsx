import { Stack, Button, Text } from "../ui-stub";
import { projectStatuses, ProjectStatus } from "../schemas/projectSchema";
import { capitalize } from "../utils/strings";

type StatusValue = ProjectStatus | "all";

interface StatusFilterProps {
  value: StatusValue;
  onChange: (v: StatusValue) => void;
}

const STATUSES: StatusValue[] = ["all", ...projectStatuses];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <Stack
      direction="row"
      gap={1}
      align="center"
      role="group"
      aria-labelledby="status-filter-label"
    >
      <Text as="span" id="status-filter-label" size="md">Status</Text>
      {STATUSES.map((status) => (
        <Button
          key={status}
          onClick={() => onChange(status)}
          aria-pressed={value === status}
          variant={value === status ? "primary" : "ghost"}
        >
          {capitalize(status)}
        </Button>
      ))}
    </Stack>
  );
}

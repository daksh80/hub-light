export function capitalize(str: string): string {
  return str ? str[0].toUpperCase() + str.slice(1) : "";
}

export function formatDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

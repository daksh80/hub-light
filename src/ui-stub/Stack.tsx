import type { HTMLAttributes } from "react";
import "./ui-stub.css";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "space-between";
}

const alignItems = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};

const justifyContent = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
};

export function Stack({
  direction = "column",
  gap,
  align,
  justify,
  className = "",
  style,
  ...rest
}: StackProps) {
  const dir = direction === "row" ? "ph-stack--row" : "ph-stack--col";
  return (
    <div
      className={`ph-stack ${dir} ${className}`.trim()}
      style={{
        ...style,
        ...(gap !== undefined ? { gap: `${gap * 0.25}rem` } : null),
        ...(align ? { alignItems: alignItems[align] } : null),
        ...(justify ? { justifyContent: justifyContent[justify] } : null),
      }}
      {...rest}
    />
  );
}

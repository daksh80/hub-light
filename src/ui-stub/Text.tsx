import type { HTMLAttributes } from "react";
import "./ui-stub.css";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: "h1" | "h2" | "h3" | "p" | "span";
  tone?: "title" | "body" | "muted" | "danger";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function Text({
  as: Tag = "p",
  tone = "body",
  size,
  className = "",
  ...rest
}: TextProps) {
  const toneClass =
    tone === "title"
      ? "ph-text--title"
      : tone === "muted"
        ? "ph-text--muted"
        : tone === "danger"
          ? "ph-text--danger"
          : "ph-text--body";
  const sizeClass = size ? `ph-text--${size}` : "";
  return <Tag className={`${toneClass} ${sizeClass} ${className}`.trim()} {...rest} />;
}

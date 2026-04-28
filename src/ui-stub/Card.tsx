import { forwardRef, type HTMLAttributes } from "react";
import "./ui-stub.css";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function Card(
  { className = "", ...rest },
  ref,
) {
  return <div ref={ref} className={`ph-card ${className}`.trim()} {...rest} />;
});

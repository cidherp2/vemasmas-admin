import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Alert({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-[0.6rem] border border-border bg-card p-4 text-sm text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function AlertTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return <h3 className={cn("mb-1 font-semibold", className)} {...props} />;
}

export function AlertDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>): React.ReactElement {
  return <p className={cn("text-muted-foreground", className)} {...props} />;
}

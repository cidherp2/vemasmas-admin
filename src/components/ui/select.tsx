import * as SelectPrimitive from "@radix-ui/react-select";
import type { ComponentPropsWithoutRef } from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<
  typeof SelectPrimitive.Trigger
>): React.ReactElement {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "focus-ring flex h-10 w-full items-center justify-between rounded-[0.55rem] border border-input bg-card px-3 text-sm shadow-sm outline-none data-[placeholder]:text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <ChevronDown className="size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
>): React.ReactElement {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cn(
          "z-50 min-w-32 overflow-hidden rounded-[0.6rem] border bg-popover p-1 text-popover-foreground shadow-xl",
          className,
        )}
        position={position}
        {...props}
      >
        {children}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<typeof SelectPrimitive.Item>): React.ReactElement {
  return (
    <SelectPrimitive.Item
      className={cn(
        "focus-ring relative flex cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-3 text-sm outline-none hover:bg-muted",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

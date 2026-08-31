"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef(
  ({ className, value, extraStyles, ...props }, ref) => {
    // Defensive clamp: guard against undefined/NaN/negative/over-100 values
    // so the indicator never renders outside its track (see BUG-005).
    const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          // cn() runs extraStyles through tailwind-merge, so an explicit
          // color class (e.g. bg-red-500) deterministically overrides the
          // default bg-primary instead of depending on Tailwind's
          // generated-CSS ordering (previously non-deterministic).
          className={cn(
            "h-full w-full flex-1 bg-primary transition-all",
            extraStyles
          )}
          style={{ transform: `translateX(-${100 - safeValue}%)` }}
        />
      </ProgressPrimitive.Root>
    );
  }
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
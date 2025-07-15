import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, className, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(checked ?? false);
    
    React.useEffect(() => {
      if (checked !== undefined) {
        setInternalChecked(checked);
      }
    }, [checked]);
    
    const toggle = () => {
      const newChecked = !internalChecked;
      if (checked === undefined) {
        setInternalChecked(newChecked);
      }
      onCheckedChange?.(newChecked);
    };
    
    return (
      <button
        type="button"
        role="switch"
        aria-checked={internalChecked}
        onClick={toggle}
        ref={ref}
        className={cn(
          "relative inline-flex h-5 w-10 items-center rounded-full transition-colors",
          internalChecked ? "bg-violet-600" : "bg-neutral-400",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-neutral-200 transition-transform",
            internalChecked ? "translate-x-[1.375rem]" : "translate-x-0.5"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
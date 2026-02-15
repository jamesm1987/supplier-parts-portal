import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
  }
);
FormItem.displayName = "FormItem";

/**
 * FormLabel now simply checks an 'error' boolean to turn red.
 */
interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  error?: boolean;
}
const FormLabel = React.forwardRef<React.ElementRef<typeof Label>, FormLabelProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <Label
        ref={ref}
        className={cn(error && "text-destructive", className)}
        {...props}
      />
    );
  }
);
FormLabel.displayName = "FormLabel";

/**
 * FormControl wraps the input. We add 'aria-invalid' if there's an error.
 */
interface FormControlProps extends React.ComponentPropsWithoutRef<typeof Slot> {
  error?: boolean;
}
const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, FormControlProps>(
  ({ error, ...props }, ref) => {
    return (
      <Slot
        ref={ref}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
FormControl.displayName = "FormControl";

/**
 * FormMessage displays the specific string from Inertia's 'errors' object.
 */
interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: string;
}
const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, error, children, ...props }, ref) => {
    const body = error || children;

    if (!body) return null;

    return (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {body}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

export { FormItem, FormLabel, FormControl, FormMessage };
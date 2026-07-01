import { Input } from "#/components/ui/input";
import { cn } from "#/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";


interface Props extends React.ComponentProps<typeof Input> {
  wrapperClassName?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, Props>(
  ({ className, wrapperClassName, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className={cn("relative", wrapperClassName)}>
        <Input
          ref={ref}
          type={show ? "text" : "password"}
          className={cn("pr-10", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

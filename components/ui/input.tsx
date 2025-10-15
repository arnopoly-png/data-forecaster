import * as React from "react";


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}


export const Input = React.forwardRef<HTMLInputElement, InputProps>(
({ className, ...props }, ref) => (
<input
ref={ref}
className={
"h-10 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30 " +
(className || "")
}
{...props}
/>
)
);
Input.displayName = "Input";

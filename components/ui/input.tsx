import * as React from "react";


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}


export const Input = React.forwardRef<HTMLInputElement, InputProps>(
({ className, ...props }, ref) => (
<input
ref={ref}
className={
"h-10 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none ring-0 focus:border-black " +
(className || "")
}
{...props}
/>
)
);
Input.displayName = "Input";

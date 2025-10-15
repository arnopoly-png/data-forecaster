import * as React from "react";


type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
variant?: "default" | "outline" | "ghost";
size?: "sm" | "md" | "lg";
};


function cn(...cls: (string | false | null | undefined)[]) {
return cls.filter(Boolean).join(" ");
}


export function Button({
className,
variant = "default",
size = "md",
...props
}: ButtonProps) {
const base = "inline-flex items-center justify-center rounded-2xl transition-colors font-medium disabled:opacity-50 disabled:pointer-events-none";
const variants = {
default: "bg-black text-white hover:bg-black/90",
outline: "border border-neutral-300 bg-white hover:bg-neutral-50",
ghost: "bg-transparent hover:bg-neutral-100",
} as const;
const sizes = {
sm: "h-9 px-3 text-sm",
md: "h-10 px-4 text-sm",
lg: "h-11 px-5 text-base",
} as const;


return (
<button className={cn(base, variants[variant], sizes[size], className)} {...props} />
);
}

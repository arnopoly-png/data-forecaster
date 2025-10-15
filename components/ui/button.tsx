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
const base = "inline-flex items-center justify-center rounded-2xl transition-colors font-medium disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const variants = {
default: "bg-primary text-primary-foreground hover:bg-primary/90",
outline: "border border-border bg-card text-foreground hover:bg-accent",
ghost: "bg-transparent text-foreground hover:bg-accent",
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

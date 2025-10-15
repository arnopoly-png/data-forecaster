import * as React from "react";


type SliderProps = {
value: number[];
min?: number;
max?: number;
step?: number;
onValueChange?: (v: number[]) => void;
className?: string;
};


export function Slider({ value, min = 0, max = 1, step = 0.01, onValueChange, className }: SliderProps) {
const v = value?.[0] ?? 0;
return (
<div className={"w-full select-none " + (className || "")}>
<input
type="range"
min={min}
max={max}
step={step}
value={Number.isFinite(v) ? v : 0}
onChange={(e) => onValueChange?.([parseFloat(e.target.value)])}
className="w-full h-2 appearance-none rounded-full bg-muted"
style={{ accentColor: "var(--primary)" }}
/>
<div className="flex justify-between text-xs text-muted-foreground mt-1">
<span>{min}</span>
<span>{max}</span>
</div>
</div>
);
}

"use client"

import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function OrderStatus({ steps = [], current }) {
    const activeStep = current?.step || 1


    const progress =
        steps.length > 1
            ? ((activeStep - 1) / (steps.length - 1)) * 100
            : 0

    return (
      <div className="w-full max-w-3xl mx-auto px-4">
    <div className="relative flex items-center justify-between">

        {/* Track */}
        <div className="absolute top-4 left-0 right-0 h-[4px] bg-slate-200 rounded-full" />

        {/* Progress Fill */}
        <div className="absolute top-4 left-0 right-0 h-[4px] rounded-full overflow-hidden">
            <div
                className="h-full bg-black transition-transform duration-700 ease-out"
                style={{
                    transform: `scaleX(${progress / 100})`,
                    transformOrigin: "left",
                }}
            />
        </div>

        {steps.map((step) => {
            const isCompleted = activeStep > step.id
            const isActive = activeStep === step.id

            return (
                <div key={step.id} className="flex flex-col items-center relative">

                    {/* Node */}
                    <div
                        className={cn(
                            "relative z-10 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300",
                            "border bg-white",

                            isCompleted &&
                            "bg-black border-black text-white",

                            isActive &&
                            "border-black text-black shadow-sm scale-110",

                            !isCompleted &&
                            !isActive &&
                            "border-slate-300 text-slate-400"
                        )}
                    >
                        {isCompleted || isActive ? (
                            <CheckCircle2
                                className={cn(
                                    "transition-all",
                                    isActive ? "w-6 h-6" : "w-4.5 h-4.5"
                                )}
                            />
                        ) : (
                            <div
                                className={cn(
                                    "w-2 h-2 rounded-full bg-current transition-opacity",
                                    isActive ? "opacity-100" : "opacity-30"
                                )}
                            />
                        )}
                    </div>

                    {/* Label */}
                    <div className="absolute top-11 w-32 text-center">
                        <p
                            className={cn(
                                "text-[11px] transition-colors leading-tight",

                                isCompleted &&
                                "text-black font-medium",

                                isActive &&
                                "text-black font-semibold",

                                !isActive &&
                                !isCompleted &&
                                "text-slate-400 font-normal"
                            )}
                        >
                            {step.name}
                        </p>
                    </div>
                </div>
            )
        })}
    </div>

    <div className="h-12" />
</div>
    )
}

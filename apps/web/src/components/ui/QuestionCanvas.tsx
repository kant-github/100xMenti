import { Template } from "@/lib/templates"
import { cn } from "@/lib/utils";
import React from "react";

interface QuestionCanvasProps {
    template: Template;
    children: React.ReactNode
    className?: string
}

export default function QuestionCanvas({ template, children, className }: QuestionCanvasProps) {
    return (
        <div className={cn("w-full max-w-4xl h-[500px] sm:h-[550px] lg:h-[550px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 rounded-xl flex flex-col border-1 border-purple-800 relative overflow-hidden select-none",
            className
        )}
            style={{
                backgroundColor: template.bg,
                color: template.textColor,
                // border: `2px solid ${template.textColor}`
            }}
        >
            {children}
        </div>
    )
}
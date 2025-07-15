import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import React from "react"


interface TooltipComponentProps {
    children: React.ReactNode;
    content: React.ReactNode;
}

export default function TooltipComponent({ children, content }: TooltipComponentProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>{children}</TooltipTrigger>
                <TooltipContent>
                    <span>{content}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>

    )
}
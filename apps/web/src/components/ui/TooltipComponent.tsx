import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import React from "react"


interface TooltipComponentProps {
    children: React.ReactNode;
    content: React.ReactNode;
}

export default function TooltipComponent({ children, content }: TooltipComponentProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                {content}
            </TooltipContent>
        </Tooltip>
    )
}





import { cn } from "@/lib/utils";
import { motion } from "framer-motion"
import { Dispatch, ForwardedRef, SetStateAction } from "react";

interface UtilityCardProps {
    children: React.ReactNode;
    className?: string;
    open?: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    ref?: ForwardedRef<HTMLDivElement>;
}

export default function UtilityCard({ children, className, ref }: UtilityCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            ref={ref}
            className={cn("dark:text-gray-200 rounded-[10px] z-40 border-[1px] border-neutral-300 px-8 py-4 shadow-md",
                className
            )}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </motion.div>
    )
}
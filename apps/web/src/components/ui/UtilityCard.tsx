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
            className={cn("",
                className
            )}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </motion.div>
    )
}
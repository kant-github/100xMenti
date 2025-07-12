import { Template } from "@/lib/templates"
import { motion } from 'framer-motion';
interface QuestionReadingProps {
    template: Template
}

export default function QuestionReading({ template }: QuestionReadingProps) {
    return (
        <motion.div
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, }}
            className="h-full w-full relative flex items-center justify-center">
            reading
        </motion.div>
    )
}
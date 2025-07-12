import Avatar from '@/components/ui/Avatar';
import DesignElementsBackground from '@/components/ui/DesignElementsBackground';
import { Template } from '@/lib/templates';
import { useliveQuizMeParticipantStore } from '@/zustand/liveQuizMeParticipant';
import { motion } from 'framer-motion';
import { ClockFading } from 'lucide-react';

export default function QuestionMotivation({ template }: { template: Template }) {
    const { participant } = useliveQuizMeParticipantStore()
    return (
        <motion.div
            initial={{ opacity: 0, }}
            animate={{ opacity: 1, }}
            className="h-full w-full relative flex items-center justify-center">


            <div className='max-w-4xl h-[500px] sm:h-[550px] lg:h-[550px] flex flex-col items-center justify-start gap-y-20 flex-shrink-0'>
                <div className='flex-1 flex flex-col justify-between items-center my-12'>
                    <DesignElementsBackground
                        design={template.design}
                        accentColor={template.designColor}
                    />
                    <ClockFading size={35} style={{ color: `${template.bars[3]}` }} />
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut"
                        }}
                        className="text-3xl font-extralight tracking-wider flex flex-col items-center gap-y-4">
                        <span className='text-sm'>Are you ready, {participant.name}!</span>
                        <span>Respond quickly to get more points!</span>
                    </motion.span>
                    <Avatar avatar={participant.avatar} name={participant.name} />
                </div>

            </div>

        </motion.div>
    )
}
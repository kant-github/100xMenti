import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BsFillHandThumbsUpFill } from "react-icons/bs";
import { useWebSocket } from "@/hooks/useWebSocket";
import { MESSAGE_TYPES } from "@/types/ws-types";
import { useLiveSessionStore } from "@/zustand/liveSession";
import { ParticipantType } from "@/types/types";

export default function WaitingLobbyBottomTicker({ participants }: { participants: ParticipantType[] }) {
    const [animatingThumbs, setAnimatingThumbs] = useState<number[]>([]);
    const [isHolding, setIsHolding] = useState(false);
    const [holdTimeout, setHoldTimeout] = useState<NodeJS.Timeout | null>(null);
    const { sendLike, subscribeToHandler } = useWebSocket()
    const { liveSession } = useLiveSessionStore()
    useEffect(() => {
        subscribeToHandler(MESSAGE_TYPES.LIKE, handleIncomingLike);
    }, [])

    function handleIncomingLike(newMessage: any) {
        console.log("incoming like message", newMessage);
        createThumbAnimation();
    }

    function createThumbAnimation() {
        const newThumbId = Date.now() + Math.random(); // Ensure unique IDs
        setAnimatingThumbs(prev => [...prev, newThumbId]);

        setTimeout(() => {
            setAnimatingThumbs(prev => prev.filter(id => id !== newThumbId));
        }, 2200);
    };

    function sendLikeMessage() {
        sendLike({
            sessionId: liveSession.id,
            timestamp: Date.now(),
        });
    };

    const handleMouseDown = () => {
        setIsHolding(true);
        createThumbAnimation(); // First animation on press
        sendLikeMessage(); // Send like message immediately

        // Start continuous animation after 300ms
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                createThumbAnimation();
                sendLikeMessage(); // Send like message for each animation
            }, 150); // Create new animation every 150ms

            // Store interval ID in a way we can clear it
            setHoldTimeout(interval as any);
        }, 300);

        setHoldTimeout(timeout);
    };

    const handleMouseUp = () => {
        setIsHolding(false);
        if (holdTimeout) {
            clearTimeout(holdTimeout);
            clearInterval(holdTimeout);
            setHoldTimeout(null);
        }
    };

    const handleMouseLeave = () => {
        // Also stop when mouse leaves the button
        handleMouseUp();
    };

    return (
        <motion.div
            className="absolute bottom-5 left-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
        >
            <div className="bg-white/85 backdrop-blur-sm rounded-full px-8 py-4 shadow-xl border border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {participants.slice(0, 3).map((participant) => (
                            <div key={participant.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                                <Image
                                    src={participant.avatar}
                                    alt={participant.name}
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                        {participants.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                                +{participants.length - 3}
                            </div>
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">Ready to begin</span>
                    <div className="relative">
                        <BsFillHandThumbsUpFill
                            size={22}
                            className="text-neutral-900 hover:text-[#ff0033] hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer select-none"
                            onMouseDown={handleMouseDown}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                            onTouchStart={handleMouseDown}
                            onTouchEnd={handleMouseUp}
                        />

                        {/* Animated thumbs up balloons */}
                        <AnimatePresence>
                            {animatingThumbs.map((thumbId) => (
                                <motion.div
                                    key={thumbId}
                                    className="absolute pointer-events-none"
                                    initial={{
                                        opacity: 1,
                                        y: 0,
                                        x: 0,
                                        scale: 1,
                                        rotate: 0
                                    }}
                                    animate={{
                                        opacity: 0,
                                        y: -120 - Math.random() * 400, // Much more vertical spread
                                        x: Math.random() * 360 - 120, // Extreme horizontal scatter
                                        scale: 1.0 + Math.random() * 1.5, // Huge scale variation
                                        rotate: Math.random() * 30 - 15 // Small jiggle rotation
                                    }}
                                    exit={{ opacity: 0 }}
                                    transition={{
                                        duration: 2.2,
                                        ease: [0.23, 1, 0.32, 1], // Custom easing for balloon-like movement
                                        opacity: { duration: 2.2, ease: "easeOut" },
                                        rotate: {
                                            duration: 0.3,
                                            ease: "easeInOut",
                                            repeat: Infinity,
                                            repeatType: "reverse"
                                        }
                                    }}
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    <BsFillHandThumbsUpFill
                                        size={22}
                                        className="text-[#ff0033] drop-shadow-lg"
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
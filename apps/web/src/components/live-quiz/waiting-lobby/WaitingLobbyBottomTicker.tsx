import Image from "next/image";
import { motion } from 'framer-motion';
import { User } from "./WaitingLobbyAvatar";
import { BsFillHandThumbsUpFill } from "react-icons/bs";


export default function WaitingLobbyBottomTicker({ users }: { users: User[] }) {
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
                        {users.slice(0, 3).map((user) => (
                            <div key={user.id} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                                <Image
                                    src={user.avatar}
                                    alt={user.name}
                                    width={32}
                                    height={32}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                        {users.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                                +{users.length - 3}
                            </div>
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">Ready to begin</span>
                    <BsFillHandThumbsUpFill size={22} className="text-neutral-900 hover:text-[#ff0033] hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer" />
                </div>
            </div>
        </motion.div>
    )
}
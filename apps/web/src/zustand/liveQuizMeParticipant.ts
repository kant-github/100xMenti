import { ParticipantType } from "@/types/types";
import { create } from "zustand";

interface LiveQuizMeParticipantProps {
    participant: ParticipantType | null,
    setParticipant: (data: ParticipantType) => void
}

export const useliveQuizMeParticipantStore = create<LiveQuizMeParticipantProps>((set) => ({
    participant: null,
    setParticipant: (data: ParticipantType) => set({ participant: data })
}))
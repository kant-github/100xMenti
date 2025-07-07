import { ParticipantType } from "@/types/types";
import { create } from "zustand";

interface LiveQuizParticipantsStoreProps {
    participants: ParticipantType[];
    setParticipants: (data: ParticipantType[]) => void;
    addParticipant: (data: ParticipantType) => void;
    updateParticipant: (participantId: string, partialData: Partial<ParticipantType>) => void;
    removeParticipant: (participantId: string) => void;
}

export const useLiveQuizParticipantsStore = create<LiveQuizParticipantsStoreProps>((set, get) => ({
    participants: [],
    setParticipants: (data: ParticipantType[]) => {
        set({ participants: data })
    },
    addParticipant: (data: ParticipantType) => set({
        participants: [...get().participants, data]
    }),
    updateParticipant: (participantId: string, partialData: Partial<ParticipantType>) => {
        const updatedParticipants = get().participants.map(participant =>
            participant.id === participantId ? { ...participant, ...partialData } : participant
        );
        set({ participants: updatedParticipants });
    },
    removeParticipant: (participantId: string) => set({
        participants: get().participants.filter(participant => participant.id !== participantId)
    })
}))
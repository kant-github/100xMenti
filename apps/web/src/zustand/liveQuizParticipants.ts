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
        let participants = get().participants;
        console.log("settup before : ", participants)
        set({ participants: data })
        participants = get().participants;
        console.log("settup after : ", participants)
    },
    addParticipant: (data: ParticipantType) => set({
        participants: [...get().participants, data]
    }),
    // In your store
    // In your store
    updateParticipant: (participantId: string, partialData: Partial<ParticipantType>) => {
        console.log("Store updateParticipant called with:", participantId, partialData);
        console.log("Current participants before update:", get().participants);

        const updatedParticipants = get().participants.map(participant =>
            participant.id === participantId ? { ...participant, ...partialData } : participant
        );

        console.log("Updated participants:", updatedParticipants);

        set({ participants: updatedParticipants });
    },
    removeParticipant: (participantId: string) => set({
        participants: get().participants.filter(participant => participant.id !== participantId)
    })
}))
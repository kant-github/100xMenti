import { ParticipantType } from "@/types/types";
import { create } from "zustand";

interface LiveQuizParticipantsStoreProps {
    participants: ParticipantType[];
    setParticipants: (data: ParticipantType[]) => void;
    addParticipant: (data: { participantId: string; avatar?: string | null; name: string; liveSessionId: string }) => void;
    updateParticipant: (participantId: string, partialData: Partial<ParticipantType>) => void;
    removeParticipant: (participantId: string) => void;
}

export const useLiveQuizParticipantsStore = create<LiveQuizParticipantsStoreProps>((set, get) => ({
    participants: [],
    setParticipants: (data: ParticipantType[]) => {
        set({ participants: data })
    },
    addParticipant: (data: { participantId: string; avatar?: string | null; name: string; liveSessionId: string }) => {
        const existingParticipant = get().participants.find(participant => participant.id === data.participantId);
        if (existingParticipant) {
            set({
                participants: get().participants.map(p =>
                    p.id === data.participantId ?
                        { ...p, isActive: true, leftAt: null } :
                        p

                )
            })
            return;
        }

        const newParticipant: ParticipantType = {
            id: data.participantId,
            name: data.name,
            isNameChanged: false,
            avatar: data.avatar || null,
            isActive: true,
            joinedAt: new Date().toISOString(),
            leftAt: null,
            totalScore: 0,
            correctCount: 0,
            incorrectCount: 0,
            sessionId: data.liveSessionId,
        };
        console.log("new participant created is : ", newParticipant);
        set({
            participants: [...get().participants, newParticipant]
        });
    },
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
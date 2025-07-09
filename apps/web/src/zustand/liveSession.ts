import { LiveSessionType } from "@/types/types";
import { create } from "zustand";

interface LiveSessionStoreProps {
    liveSession: LiveSessionType | null;
    setLiveSession: (data: LiveSessionType) => void;
    updateSession: (data: Partial<LiveSessionType>) => void;
}

export const useLiveSessionStore = create<LiveSessionStoreProps>((set, get) => ({
    liveSession: null,
    setLiveSession: (data) => set({ liveSession: data }),
    updateSession: (data: Partial<LiveSessionType>) => {
        const currentLiveSessionData = get().liveSession;
        if (!currentLiveSessionData) return;

        set({
            liveSession: {
                ...currentLiveSessionData,
                ...data
            }
        })

    }
}))
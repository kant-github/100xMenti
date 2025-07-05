import { LiveSessionType } from "@/types/types";
import { create } from "zustand";

interface LiveSessionStoreProps {
    liveSession: LiveSessionType | null
    setLiveSession: (data: LiveSessionType) => void
}

export const useLiveSessionStore = create<LiveSessionStoreProps>((set) => ({
    liveSession: null,
    setLiveSession: (data) => set({ liveSession: data })
}))
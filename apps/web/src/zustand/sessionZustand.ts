import { create } from 'zustand'
import { ISODateString } from "next-auth";
import { UserType } from "../../app/api/auth/[...nextauth]/options";

export interface CustomSession {
    user?: UserType;
    expires: ISODateString;
}

type SessionStore = {
    session: CustomSession | null;
    setSession: (session: CustomSession) => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
    session: null,
    setSession: (session: CustomSession) => set({ session }),
}))

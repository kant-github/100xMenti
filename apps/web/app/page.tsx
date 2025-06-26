'use client'
import { useOwnerQuizsStore } from "@/zustand/ownerQuizsStore";
import NavBar from "../src/components/navbar/NavBar"
import { useSessionStore } from "@/zustand/sessionZustand";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";
import { GET_OWNER_QUIZS_URL } from "@/lib/api_routes";

export default function Home() {
  const { data: sessionData, status } = useSession();
  const { session, setSession } = useSessionStore();
  const { setQuizs } = useOwnerQuizsStore();

  async function getOwnerQuizs() {
    if (!session?.user?.token) {
      console.log("No session or token available");
      return;
    }
    try {
      const { data } = await axios.get(`${GET_OWNER_QUIZS_URL}`, {
        headers: {
          Authorization: `Bearer ${session.user.token}`
        }
      });

      if (data.data) {
        console.log("data is  ", data.data);
        setQuizs(data.data);
      }
    } catch (err) {
      console.error("Error in getting the data", err);
    }
  }

  useEffect(() => {
    if (status !== 'loading' && sessionData) {
      setSession(sessionData);
    }
  }, [sessionData, status, setSession]);

  useEffect(() => {
    console.log("status is : ", status);

    if (session && session?.user?.token) {
      getOwnerQuizs();
    }
  }, [session]);

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 h-screen">
      <NavBar />
    </div>
  );
}
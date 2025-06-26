'use client'
import { signOut } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import UtilityCard from "./UtilityCard";
import { Button } from "./button";
import { handleClickOutside } from "@/lib/handleClickOutisde";
import OpacityBackground from "./OpacityBackground";

interface props {
    logoutDropdown: boolean;
    setLogoutDropDown: Dispatch<SetStateAction<boolean>>;
}


export default function LogOutModal({ logoutDropdown, setLogoutDropDown }: props) {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function clickHandler(event: MouseEvent) {
            handleClickOutside(event, ref, setLogoutDropDown);
        }

        if (logoutDropdown) {
            document.addEventListener("mousedown", clickHandler);
            return () => {
                document.removeEventListener("mousedown", clickHandler);
            };
        }
    }, [logoutDropdown, setLogoutDropDown])

    async function handleLogout() {
        await signOut({
            redirect: true,
        })
    }

    return (
        <OpacityBackground className="z-50 bg-black/20 backdrop-blur-[1px]" onBackgroundClick={() => setLogoutDropDown(false)}>
            <UtilityCard ref={ref} className="dark:bg-neutral-800 bg-neutral-200 dark:border-neutral-600 border-neutral-300 border-[1px] max-w-lg p-6 relative rounded-xl">
                <div className="w-[400px]">
                    <div className="flex justify-between">
                        <p className="text-md font-bold mb-4">
                            Log out
                        </p>
                    </div>
                    <p className="text-xs font-light mb-4">
                        Are you sure you want to log out? <br />
                        You can come back anytime, Press cancel to stay !!
                    </p>
                    <div className="items-center justify-end gap-4 pt-4 pr-2 w-full grid grid-cols-2">
                        <Button className="border-[1px] border-neutral-300 bg-neutral-100" onClick={() => setLogoutDropDown(false)}>Cancel</Button>
                        <Button className="bg-red-500" onClick={handleLogout}>
                            Log out
                        </Button>
                    </div>
                </div>
            </UtilityCard>
        </OpacityBackground>
    )
}
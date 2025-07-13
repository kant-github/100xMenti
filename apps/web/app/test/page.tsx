'use client'

import { Button } from "@/components/ui/button"
import TimerBar from "@/components/ui/TimerBar"
import { useState } from "react"

export default function Home() {
    const [render, setRender] = useState<boolean>(false);
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <Button onClick={() => setRender(true)}>
                render
            </Button>
            {render && <TimerBar timer={20000} bg="#1e1e1e"/>}
        </div>
    )
}
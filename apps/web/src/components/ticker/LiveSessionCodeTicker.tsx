import { Check, CopyIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface LiveSessionCodeTickerProps {
    sessionCode: string
}

export default function LiveSessionCodeTicker({ sessionCode }: LiveSessionCodeTickerProps) {
    const [copied, setCopied] = useState<boolean>(false);
    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 2000)
        }
    }, [copied])

    function copyHandler() {
        if (!copied) {
            navigator.clipboard.writeText(sessionCode);
        }
        setCopied(true);
    }
    return (
        <div className="absolute right-1/2 translate-x-1/2 top-4 bg-neutral-200 px-5 py-2.5 rounded-lg border-[1px] border-neutral-300 backdrop-blur-md shadow-md flex items-center justify-center gap-x-2 transition-all z-[50]">
            <span className="text-neutral-950 font-semibold text-sm">Use this code to join </span>
            <div onClick={copyHandler} className="group bg-neutral-800 text-neutral-100 px-2.5 py-1 rounded-lg flex items-center justify-center gap-x-2 cursor-pointer select-none">
                {!copied ? (
                    <CopyIcon className="max-w-0 group-hover:max-w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden" size={12} />
                ) : (
                    <Check className="max-w-0 group-hover:max-w-3 opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden" size={12} />
                )}
                <span className="tracking-[4px] text-white">{sessionCode}</span>
            </div>
        </div>
    )
}
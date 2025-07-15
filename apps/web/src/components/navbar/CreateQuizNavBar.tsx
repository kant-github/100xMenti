import AppLogo from "../ui/AppLogo";
import { Button } from "../ui/button";
import ProfileModal from "../ui/ProfileModal";
import { FaCaretDown } from "react-icons/fa";

export default function CreateQuizNavBar() {

    return (
        <div className="w-full h-20 bg-neutral-100 flex items-center justify-between px-12">
            <AppLogo />
            <div className="flex items-center justify-center gap-4">
                
                <Button className="bg-neutral-900 hover:bg-neutral-900 text-neutral-200 font-light text-sm rounded-full flex flex-row items-center py-0 px-1 overflow-hidden gap-0">
                    <div className="border-r-[1px] border-neutral-300 px-4 py-2 flex items-center">
                        Launch
                    </div>
                    <div className="px-3 py-2 flex items-center">
                        <FaCaretDown className="w-4 h-4" />
                    </div>
                </Button>
                <ProfileModal />
            </div>
        </div>
    );
}
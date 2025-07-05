import HostLiveLeftPanel from "../host/HostLiveLeftPanel";
import HostLiveRightPanel from "../host/HostLiveRightPanel";

export default function LiveQuizQuestionActiveComponent() {
    return (
        <div className="w-full h-screen overflow-hidden grid grid-cols-[70%_30%]">
            <HostLiveLeftPanel />
            <HostLiveRightPanel />
        </div>
    )
}
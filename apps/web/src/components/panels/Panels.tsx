import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";


export default function Panels() {

    

    return (
        <div className="flex h-screen w-full overflow-hidden bg-neutral-200">
            <LeftPanel />
            <RightPanel />
        </div>
    );
}

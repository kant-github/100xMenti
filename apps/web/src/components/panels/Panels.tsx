import RightPanel from "./RightPanel";
import LeftPanel from "./LeftPanel";

export const templates = [
  {
    id: 'classic',
    name: 'Deep Blue Classic',
    bg: '#2563EB',
    bars: ['#2A1458', '#FFC107', '#B22222', '#06D001'],
  },
  {
    id: 'modern',
    name: 'Electric Modern',
    bg: '#7C3AED',
    accent: '#d1beff',
    bars: ['#640D5F', '#D91656', '#EB5B00', '#FFB200'],
  },
  {
    id: 'pastel',
    name: 'Pastel Dream',
    bg: '#CD5656',
    accent: '#fcd5b4',
    bars: ['#819A91', '#687FE5', '#F7CFD8', '#FED7AA'],
  },
  {
    id: 'neon',
    name: 'Neon Night',
    bg: '#30353c',
    accent: '#484c53',
    bars: ['#CF0F47', '#344CB7', '#007F73', '#FFAF00'],
  },
  {
    id: 'yellow',
    name: 'Yellow Mellow',
    bg: '#FFDB00',
    accent: '#AF47D2',
    bars: ['#007F73', '#344CB7', '#AF47D2', '#CF0F47'],
  },
  {
    id: 'green',
    name: 'Jungle Green',
    bg: '#06923E',
    accent: '#fcd5b4',
    bars: ['#D91656', '#143D60', '#FFC700', '#FC4100'],
  },
];


export default function Panels() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-neutral-200">
            <LeftPanel />
            <RightPanel />
        </div>
    );
}

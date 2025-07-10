const templates: Template[] = [
  {
    id: 'CLASSIC',
    name: 'Classic White',
    bg: '#FDFAF6',
    bars: ['#2A1458', '#FFC107', '#B22222', '#06D001'] as [string, string, string, string],
  },
  {
    id: 'MODERN',
    name: 'Electric Modern',
    bg: '#F5F5F5',
    accent: '#d1beff',
    bars: ['#640D5F', '#D91656', '#EB5B00', '#FFB200'] as [string, string, string, string],
  },
  {
    id: 'PASTEL',
    name: 'Pastel Dream',
    bg: '#06923E',
    textColor: '#EEEEEE',
    design: 'circle',
    accent: '#B2CD9C',
    bars: ['#000000', '#CB0404', '#483AA0', '#FFC107'] as [string, string, string, string],
  },
  {
    id: 'NEON',
    name: 'Neon Night',
    bg: '#30353c',
    accent: '#484c53',
    bars: ['#CF0F47', '#344CB7', '#007F73', '#FFAF00'] as [string, string, string, string],
  },
  {
    id: 'YELLOW',
    name: 'Yellow Mellow',
    bg: '#FFDB00',
    accent: '#AF47D2',
    bars: ['#007F73', '#344CB7', '#AF47D2', '#CF0F47'] as [string, string, string, string],
  },
  {
    id: 'GREEN',
    name: 'Jungle Green',
    bg: '#06923E',
    accent: '#fcd5b4',
    bars: ['#D91656', '#143D60', '#FFC700', '#FC4100'] as [string, string, string, string],
  },
];

export default templates;

export interface Template {
    id: string;
    name: string;
    bg: string;
    textColor?: string;
    design?: 'circle' | 'staircase' | 'wave' | 'hexagon' | 'diamond' | 'triangle' | 'spiral' | 'gradient' | 'dots';
    accent?: string;
    bars: [string, string, string, string];
}
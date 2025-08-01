const templates: Template[] = [
    // {
    //     id: 'CLASSIC',
    //     name: 'Classic White',
    //     bg: '#FDFAF6',
    //     bars: ['#2A1458', '#FFC107', '#B22222', '#06D001'] as [string, string, string, string],
    // },
    {
        id: 'MODERN',
        name: 'Electric Modern',
        src: "pink-template",
        bg: '#ff80ab',
        textColor: '#000000',
        design: 'wave',
        designColor: '#EEEEEE',
        accent: '#ff91b6',
        bars: ['#196cff', '#ffd439', '#FF2929', '#0e6b45'] as [string, string, string, string],
    },
    {
        id: 'PASTEL',
        name: 'Blue Glue',
        src: "blue-template",
        bg: '#0065F8',
        textColor: '#EEEEEE',
        design: 'slash',
        accent: '#0065F8',
        bars: ['#06D001', '#000000', '#FF6500', '#FFC107'] as [string, string, string, string],
    },
    {
        id: 'NEON',
        name: 'Neon Night',
        src: "black-template",
        bg: '#0d0d0d',
        textColor: '#EEEEEE',
        design: 'staircase',
        designColor: '#616161',
        accent: '#141414',
        bars: ['#CF0F47', '#344CB7', '#007F73', '#FFAF00'] as [string, string, string, string],
    },
    {
        id: 'YELLOW',
        name: 'Yellow Mellow',
        src: "yellow-template",
        bg: '#FFC107',
        textColor: '#000000',
        design: 'donut',
        designColor: '#DC2525',
        accent: '#FFCC00',
        bars: ['#06923E', '#030303', '#FFF2EB', '#DC2525'] as [string, string, string, string],
    },
    {
        id: 'GREEN',
        name: 'Jungle Green',
        src: "green-template",
        bg: '#00712D',
        textColor: '#EEEEEE',
        design: 'circle',
        accent: '#00712D',
        bars: ['#000000', '#CB0404', '#483AA0', '#FFC107'] as [string, string, string, string],
    },
];

export default templates;

export interface Template {
    id: string;
    name: string;
    src?: string;
    bg: string;
    textColor?: string;
    design?: 'circle' | 'staircase' | 'wave' | 'hexagon' | 'diamond' | 'triangle' | 'spiral' | 'gradient' | 'dots' | 'donut' | 'slash';
    designColor?: string;
    accent?: string;
    bars: [string, string, string, string];
}
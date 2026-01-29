export interface Stat {
    label: string;
    value: string;
}

export interface Service {
    id: number;
    link: string;
    icon: string;
    title: string;
    subtext: string;
    stats?: Stat[];
}

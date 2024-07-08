import type { Theme } from './Theme';

export interface Carte {
    id: number;
    question: string;
    reponse: string;
    theme: Theme;
}

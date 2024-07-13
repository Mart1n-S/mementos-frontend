import type { Carte } from './Carte';

export interface Revision {
    id: number;
    user_id: number;
    dateRevision: string;
    carte: Carte;
}

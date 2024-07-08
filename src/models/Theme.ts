import type { User } from './User';

export interface Theme {
    id: number;
    nom: string;
    couleur: string;
    category_id: number;
    user_id: number;
    public: boolean;
    user: User;
}

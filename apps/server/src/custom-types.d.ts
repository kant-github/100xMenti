interface AuthUser {
    id: number;
    name: string;
    email: string;
    google_id: string;
    image?: string;
}

declare namespace Express {
    export interface Request {
        user?: AuthUser;
    }
}
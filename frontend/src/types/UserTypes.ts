// types/UserTypes.ts
export interface UserDto {
    id: string;             // UUID
    email: string;          // Email address
    firstName: string;      // First name
    lastName: string;       // Last name
    createdAt: string;      // ISO timestamp
    updatedAt?: string;     // ISO timestamp (optional)
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
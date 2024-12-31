// types/UserTypes.ts
export interface UserDetailsDto {
    id: string; // UUID as a string
    email: string;
    firstName: string;
    lastName: string;
    currencyBalance: number; // Long in Java maps to number in TypeScript
    notificationsEnabled: boolean;
    createdAt: string; // LocalDateTime as ISO string
    modifiedAt: string; // LocalDateTime as ISO string
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
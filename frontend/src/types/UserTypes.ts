// types/UserTypes.ts
export interface UserDetailsDto {
    id: string; // UUID as a string
    email: string;
    firstName: string;
    lastName: string;
    currencyBalance: number; // Long in Java maps to number in TypeScript
    notificationsEnabled: boolean;
    goal: string;
    notificationTimes: string[]; // Array of LocalTime in ISO string format
    createdAt: string; // LocalDateTime as ISO string
    modifiedAt: string; // LocalDateTime as ISO string
}
export interface UserUpdateDto {
    firstName: string;
    lastName: string;
    goal: string;
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

export interface NotificationEnableRequest {
    enabled: boolean;
}

export interface NotificationTimeRequest {
    time: string; // LocalTime in ISO string format
}
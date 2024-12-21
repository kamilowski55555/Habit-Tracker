// types/HabitTypes.ts
export interface HabitListDto {
    id: string;              // UUID
    name: string;            // Habit name
    type: 'GOOD' | 'BAD';    // Habit type (enum as string)
    targetValue: number;     // Target value for success
    habitDays: string[];     // Days of the week
    currencyAmount: number;  // Coins rewarded or deducted
    icon?: string;           // Optional icon (emoji or URL)
}

export interface HabitDetailsDto extends HabitListDto {
    habitDays: string[];     // Days of the week (e.g., ['MONDAY', 'WEDNESDAY'])
    createdBy: string;       // UUID of the creator
    updatedBy?: string;      // UUID of the last updater
    createdAt: string;       // ISO timestamp
    updatedAt?: string;      // ISO timestamp
}

export interface HabitCreateDto {
    name: string;            // Habit name
    type: 'GOOD' | 'BAD';    // Habit type
    targetValue: number;     // Target value for success
    habitDays: string[];     // Days of the week
    currencyAmount: number;  // Coins rewarded or deducted
    icon?: string;           // Optional icon
}

export interface HabitModifyDto {
    name: string;            // Habit name
    type: 'GOOD' | 'BAD';    // Habit type
    targetValue: number;     // Target value for success
    habitDays: string[];     // Days of the week
    currencyAmount: number;  // Coins rewarded or deducted
    icon?: string;           // Optional icon
}

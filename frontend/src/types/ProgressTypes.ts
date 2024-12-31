// types/ProgressTypes.ts
export interface ProgressListDto {
    id: string;              // UUID
    name: string;            // Habit name
    type: 'GOOD' | 'BAD';    // Habit type (enum as string)
    targetValue: number;     // Target value for success
    currentValue: number;    // Current value
    date: string;            // ISO timestamp
}

export interface ProgressModifyDto {
    currentValue: number;
}
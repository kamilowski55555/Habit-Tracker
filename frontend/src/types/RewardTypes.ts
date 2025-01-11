// types/RewardTypes.ts

// Represents the reward list item
export interface RewardListDto {
    emoji: string;
    id: string; // UUID
    name: string; // Name of the reward
    cost: number; // Cost to redeem the reward
}

// Represents the payload for creating a reward
export interface RewardCreateDto {
    name: string; // Name of the reward
    cost: number; // Cost to redeem the reward
    emoji: string; // Emoji for the reward
}

// Represents the payload for modifying a reward
export interface RewardModifyDto {
    name: string; // Name of the reward
    cost: number; // Cost to redeem the reward
    emoji: string;
}

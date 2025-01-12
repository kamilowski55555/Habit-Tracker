// types/GptTypes.ts

export interface GptRequestDto {
    message: string; // User's input message to GPT (max 500 characters)
}

export interface GptResponseDto {
    response: string; // GPT's reply
}

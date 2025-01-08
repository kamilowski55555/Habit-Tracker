import React from 'react';
import { Box, Button } from '@mui/material';

// Define the mapping between frontend and backend formats
const frontendToBackendDays: { [key: string]: string } = {
    MO: 'MONDAY',
    TU: 'TUESDAY',
    WE: 'WEDNESDAY',
    TH: 'THURSDAY',
    FR: 'FRIDAY',
    SA: 'SATURDAY',
    SU: 'SUNDAY',
};

const backendToFrontendDays: { [key: string]: string } = {
    MONDAY: 'MO',
    TUESDAY: 'TU',
    WEDNESDAY: 'WE',
    THURSDAY: 'TH',
    FRIDAY: 'FR',
    SATURDAY: 'SA',
    SUNDAY: 'SU',
};

// Get an ordered array of days for frontend display
const daysOfWeek = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

interface DaySelectorProps {
    selectedDays: string[]; // Frontend format: ['MO', 'TU', 'WE']
    onChange: (days: string[]) => void; // Callback when selection changes
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDays, onChange }) => {
    // Toggle the selection of a day
    const toggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
            // Remove the day from the selection
            onChange(selectedDays.filter((d) => d !== day));
        } else {
            // Add the day to the selection
            onChange([...selectedDays, day]);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap', // Allow wrapping
                justifyContent: 'center',
                gap: 1,
                maxWidth: '100%', // Prevent overflow
            }}
        >
            {daysOfWeek.map((day) => (
                <Button
                    key={day}
                    variant={selectedDays.includes(day) ? 'contained' : 'outlined'}
                    color={selectedDays.includes(day) ? 'primary' : 'default'}
                    onClick={() => toggleDay(day)}
                    sx={{
                        minWidth: 40, // Ensure consistent button width
                        maxWidth: 60, // Prevent overly large buttons
                    }}
                >
                    {day}
                </Button>
            ))}
        </Box>
    );
};

// Helper functions to map between frontend and backend formats
export const mapToBackendDays = (days: string[]): string[] => {
    return days.map((day) => frontendToBackendDays[day]);
};

export const mapToFrontendDays = (days: string[]): string[] => {
    return days.map((day) => backendToFrontendDays[day]);
};

export default DaySelector;

import React from 'react';
import { List } from '@mui/material';
import { HabitListDto } from '../../types';
import HabitCard from './HabitCard';

interface HabitListProps {
    habits: HabitListDto[];
    onEdit: (habit: HabitListDto) => void;
    onDelete: (habitId: string) => void;
    onStats: (habitId: string) => void; // New handler for viewing stats
}

const HabitList: React.FC<HabitListProps> = ({ habits, onEdit, onDelete, onStats }) => {
    return (
        <List>
            {habits.map((habit) => (
                <HabitCard
                    key={habit.id}
                    habit={habit}
                    onEdit={() => onEdit(habit)}
                    onDelete={() => onDelete(habit.id)}
                    onStats={() => onStats(habit.id)} // Pass stats handler
                />
            ))}
        </List>
    );
};

export default HabitList;

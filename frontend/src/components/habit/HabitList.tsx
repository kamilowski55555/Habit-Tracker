import React from 'react';
import {List, Typography} from '@mui/material';
import HabitCard from './HabitCard';
import { HabitListDto } from '../../types';

interface HabitListProps {
    habits: HabitListDto[];
    onEdit: (habit: HabitListDto) => void;
    onDelete: (habitId: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onEdit, onDelete }) => {
    return (
        <List>
            {habits.length === 0 ? (
                <Typography>No habits found.</Typography>
            ) : (
                habits.map((habit) => (
                    <HabitCard
                        key={habit.id}
                        habit={habit}
                        onEdit={() => onEdit(habit)}
                        onDelete={() => onDelete(habit.id)}
                    />
                ))
            )}
        </List>
    );
};

export default HabitList;

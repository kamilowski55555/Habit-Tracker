import React from 'react';
import { List } from '@mui/material';
import HabitCard from './HabitCard';
import { HabitListDto } from '../../types';

interface HabitListProps {
    habits: HabitListDto[];
}

const HabitList: React.FC<HabitListProps> = ({ habits }) => {
    return (
        <List>
            {habits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
            ))}
        </List>
    );
};

export default HabitList;

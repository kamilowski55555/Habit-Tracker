import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import HabitList from '../components/habit/HabitList';
import HabitStatsDialog from '../components/habit/HabitStatsDialog';
import HabitService from '../services/HabitService';
import { HabitListDto, HabitCreateDto } from '../types';
import CreateHabitModal from '../components/habit/CreateHabitModal';
import EditHabitModal from '../components/habit/EditHabitModal';
import GptFloatingButton from "../components/layout/GptFloatingButton.tsx";

const HabitsPage: React.FC = () => {
    const [habits, setHabits] = useState<HabitListDto[]>([]); // Store habit list
    const [loading, setLoading] = useState(false); // Track loading state
    const [openCreate, setOpenCreate] = useState(false); // Control CreateHabitModal
    const [editingHabit, setEditingHabit] = useState<HabitListDto | null>(null); // Track habit to edit
    const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null); // Track habit for stats
    const [statsDialogOpen, setStatsDialogOpen] = useState(false); // Control stats dialog visibility

    // Fetch habits from the backend
    const fetchHabits = async () => {
        setLoading(true); // Show loading state
        try {
            const data = await HabitService.getHabits();
            setHabits(data);
        } catch (error) {
            console.error('Failed to fetch habits:', error);
            alert('Failed to load habits. Please try again later.');
        } finally {
            setLoading(false); // Stop loading state
        }
    };

    useEffect(() => {
        fetchHabits(); // Load habits on component mount
    }, []);

    const handleCreateHabit = async (habitData: HabitCreateDto) => {
        try {
            await HabitService.createHabit(habitData);
            fetchHabits(); // Refresh habits after creation
            alert('Habit created successfully!');
        } catch (error) {
            console.error('Failed to create habit:', error);
            alert('Failed to create habit. Please try again.');
        } finally {
            setOpenCreate(false); // Close the modal
        }
    };

    const handleEditHabit = async (habitId: string, habitData: HabitCreateDto) => {
        try {
            await HabitService.modifyHabit(habitId, habitData);
            fetchHabits(); // Refresh habits after update
            alert('Habit updated successfully!');
        } catch (error) {
            console.error('Failed to update habit:', error);
            alert('Failed to update habit. Please try again.');
        } finally {
            setEditingHabit(null); // Close the modal
        }
    };

    const handleDeleteHabit = async (habitId: string) => {
        try {
            await HabitService.deleteHabit(habitId);
            fetchHabits(); // Refresh habits after deletion
            alert('Habit deleted successfully!');
        } catch (error) {
            console.error('Failed to delete habit:', error);
            alert('Failed to delete habit. Please try again.');
        }
    };

    const handleViewStats = (habitId: string) => {
        setSelectedHabitId(habitId);
        setStatsDialogOpen(true);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Your Habits
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenCreate(true)}
                sx={{ marginBottom: 2 }}
            >
                Add New Habit
            </Button>

            {loading ? (
                <CircularProgress /> // Show a spinner while loading
            ) : (
                <HabitList
                    habits={habits}
                    onEdit={(habit) => setEditingHabit(habit)}
                    onDelete={handleDeleteHabit}
                    onStats={handleViewStats} // Pass stats handler
                />
            )}

            {/* Modal for creating habits */}
            <CreateHabitModal
                open={openCreate}
                onClose={() => setOpenCreate(false)}
                onSubmit={handleCreateHabit}
            />

            {/* Modal for editing habits */}
            {editingHabit && (
                <EditHabitModal
                    open={!!editingHabit} // Ensures the modal visibility aligns with editingHabit's existence
                    onClose={() => setEditingHabit(null)}
                    habit={editingHabit} // Passes the habit to pre-fill the form
                    onSubmit={(habitData) => handleEditHabit(editingHabit.id, habitData)}
                />
            )}

            {/* Stats Dialog */}
            {selectedHabitId && (
                <HabitStatsDialog
                    open={statsDialogOpen}
                    habitId={selectedHabitId}
                    onClose={() => setStatsDialogOpen(false)}
                />
            )}

            {/* Floating GPT Assistant Button */}
            <GptFloatingButton />
        </Box>
    );
};

export default HabitsPage;

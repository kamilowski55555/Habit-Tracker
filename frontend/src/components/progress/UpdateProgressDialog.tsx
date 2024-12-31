import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Slider,
    TextField,
    Box,
    Typography,
} from '@mui/material';
import { ProgressListDto } from '../../types/ProgressTypes';

interface UpdateProgressDialogProps {
    open: boolean;
    progress: ProgressListDto; // The current progress to update
    onClose: () => void; // Callback to close the dialog without saving
    onSave: (updatedValue: number) => void; // Callback to save changes
}

const UpdateProgressDialog: React.FC<UpdateProgressDialogProps> = ({
                                                                       open,
                                                                       progress,
                                                                       onClose,
                                                                       onSave,
                                                                   }) => {
    const [currentValue, setCurrentValue] = useState<number>(progress.currentValue);

    // Handle slider and input changes
    const handleSliderChange = (_event: Event, newValue: number | number[]) => {
        setCurrentValue(newValue as number);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (!isNaN(value) && value >= 0) {
            setCurrentValue(value);
        }
    };

    const handleSave = () => {
        onSave(currentValue); // Pass updated value to parent
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Update Progress</DialogTitle>
            <DialogContent>
                <Box sx={{ marginBottom: 3 }}>
                    <Typography gutterBottom>
                        {progress.name}: {currentValue}/{progress.targetValue}
                    </Typography>
                    <Slider
                        value={currentValue}
                        min={0}
                        max={progress.targetValue}
                        step={1}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                    />
                </Box>
                <TextField
                    label="Enter Progress"
                    type="number"
                    value={currentValue}
                    onChange={handleInputChange}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateProgressDialog;

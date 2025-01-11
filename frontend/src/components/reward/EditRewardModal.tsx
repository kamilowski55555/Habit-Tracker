import ReactDOM from 'react-dom';
import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
} from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import { RewardListDto } from '../../types/RewardTypes';

interface EditRewardModalProps {
    open: boolean;
    reward: RewardListDto | null;
    onClose: () => void;
    onSubmit: (updatedReward: { id: string; name: string; cost: number; emoji: string }) => void;
}

const EditRewardModal: React.FC<EditRewardModalProps> = ({ open, reward, onClose, onSubmit }) => {
    const [name, setName] = useState<string>(''); // Reward name
    const [cost, setCost] = useState<number>(0); // Reward cost
    const [emoji, setEmoji] = useState<string>('😊'); // Reward emoji with default value
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false); // Emoji picker toggle
    const emojiButtonRef = useRef<HTMLButtonElement | null>(null); // Ref for emoji button
    const pickerRef = useRef<HTMLDivElement | null>(null); // Ref for emoji picker

    // Populate the fields with the selected reward's data when it changes
    useEffect(() => {
        if (reward) {
            setName(reward.name);
            setCost(reward.cost);
            setEmoji(reward.emoji || '😊');
        }
    }, [reward]);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node) &&
                !emojiButtonRef.current?.contains(event.target as Node)
            ) {
                setIsEmojiPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const handleSubmit = () => {
        if (!name.trim()) {
            alert('Reward name cannot be empty.');
            return;
        }
        if (cost <= 0) {
            alert('Cost must be greater than 0.');
            return;
        }
        if (reward) {
            onSubmit({ id: reward.id, name, cost, emoji });
            setIsEmojiPickerOpen(false);
            onClose();
        }
    };

    const handleEmojiClick = (emojiData: { emoji: string }) => {
        setEmoji(emojiData.emoji);
        setIsEmojiPickerOpen(false);
    };

    const getEmojiPickerPosition = () => {
        const buttonRect = emojiButtonRef.current?.getBoundingClientRect();
        const pickerWidth = 350; // Approximate width of the emoji picker
        const pickerHeight = 400; // Approximate height of the emoji picker

        if (buttonRect) {
            let top = buttonRect.bottom + window.scrollY + 5; // Position below the button
            let left = buttonRect.left + window.scrollX; // Align horizontally with the button

            if (left + pickerWidth > window.innerWidth) {
                left = window.innerWidth - pickerWidth - 10; // Shift left
            }
            if (top + pickerHeight > window.innerHeight) {
                top = buttonRect.top + window.scrollY - pickerHeight - 5; // Shift above
            }
            return { top, left };
        }
        return { top: 0, left: 0 };
    };

    const emojiPickerPortal = isEmojiPickerOpen
        ? ReactDOM.createPortal(
            <div
                ref={pickerRef}
                style={{
                    position: 'absolute',
                    top: getEmojiPickerPosition().top,
                    left: getEmojiPickerPosition().left,
                    zIndex: 1300,
                    backgroundColor: 'white',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    maxWidth: '350px',
                    maxHeight: '400px',
                }}
            >
                <EmojiPicker onEmojiClick={handleEmojiClick} searchDisabled={true} />
            </div>,
            document.body
        )
        : null;

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Edit Reward</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Reward Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Reward Cost"
                            value={cost}
                            onChange={(e) => setCost(Number(e.target.value))}
                            type="number"
                            fullWidth
                            required
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1">Selected Emoji:</Typography>
                            <Typography variant="body1" sx={{ fontSize: '1.5rem' }}>
                                {emoji}
                            </Typography>
                            <Button
                                ref={emojiButtonRef}
                                variant="outlined"
                                onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
                            >
                                {isEmojiPickerOpen ? 'Close Emoji Picker' : 'Choose Emoji'}
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            {emojiPickerPortal}
        </>
    );
};

export default EditRewardModal;

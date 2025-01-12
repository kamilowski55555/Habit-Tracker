import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
    Typography,
    Box,
} from '@mui/material';
import GptService from '../../services/GptService';

interface GptChatDialogProps {
    open: boolean;
    onClose: () => void;
}

const GptChatDialog: React.FC<GptChatDialogProps> = ({ open, onClose }) => {
    const [message, setMessage] = useState<string>(''); // User input
    const [response, setResponse] = useState<string>(''); // GPT response
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    const handleSend = async () => {
        if (!message.trim()) {
            setError('Message cannot be empty.');
            return;
        }

        setLoading(true);
        setError(null);
        setResponse('');
        try {
            const gptResponse = await GptService.chat(message);
            setResponse(gptResponse);
        } catch (err) {
            console.error('Error communicating with GPT:', err);
            setError('Failed to communicate with GPT. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setMessage('');
        setResponse('');
        setError(null);
        setLoading(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Chat with GPT</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Your Question"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        multiline
                        rows={3}
                        error={!!error}
                        helperText={error || 'Ask GPT about habits or rewards!'}
                    />
                    {loading ? (
                        <Box display="flex" justifyContent="center" my={2}>
                            <CircularProgress />
                        </Box>
                    ) : response ? (
                        <Typography variant="body1" color="text.primary">
                            {response}
                        </Typography>
                    ) : null}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Close
                </Button>
                <Button onClick={handleSend} variant="contained" color="primary" disabled={loading}>
                    Send
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GptChatDialog;

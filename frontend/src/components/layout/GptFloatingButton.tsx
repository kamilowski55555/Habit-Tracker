import React, { useState } from 'react';
import { Fab } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import GptChatDialog from '../gpt/GptChatDialog';

const GptFloatingButton: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <>
            <Fab
                color="primary"
                aria-label="chat"
                sx={{
                    position: 'fixed',
                    bottom: 65,
                    right: 16,
                    zIndex: 1200, // Ensure it appears above other components
                }}
                onClick={() => setDialogOpen(true)}
            >
                <ChatIcon />
            </Fab>
            <GptChatDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
        </>
    );
};

export default GptFloatingButton;

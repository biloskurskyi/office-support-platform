// src/components/UI/SubmitButton.tsx
import React from 'react';
import { Button, Grid } from '@mui/material';

interface SubmitButtonProps {
    text: string;
    onSubmit: () => void;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text, onSubmit }) => {
    return (
        <Grid item xs={12}>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                onClick={onSubmit}
                sx={{
                    marginTop: '16px',
                }}
            >
                {text}
            </Button>
        </Grid>
    );
};

export default SubmitButton;

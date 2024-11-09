// src/components/UI/FormPaper.tsx
import React from 'react';
import { Paper, Typography } from '@mui/material';

interface FormPaperProps {
    title: string;
    children: React.ReactNode;
}

const FormPaper: React.FC<FormPaperProps> = ({ title, children }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                padding: '30px',
                width: '400px',
                borderRadius: '8px',
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                {title}
            </Typography>
            {children}
        </Paper>
    );
};

export default FormPaper;

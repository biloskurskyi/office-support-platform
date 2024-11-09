// src/components/UI/TextFieldWithLabel.tsx
import React from 'react';
import { TextField, Grid } from '@mui/material';

interface TextFieldWithLabelProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

const TextFieldWithLabel: React.FC<TextFieldWithLabelProps> = ({ label, name, value, onChange, type = 'text' }) => {
    return (
        <Grid item xs={12}>
            <TextField
                fullWidth
                label={label}
                variant="outlined"
                name={name}
                value={value}
                onChange={onChange}
                type={type}
            />
        </Grid>
    );
};

export default TextFieldWithLabel;

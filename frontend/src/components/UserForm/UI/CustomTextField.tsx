import React from 'react';
import { TextField, Grid } from '@mui/material';

const CustomTextField = ({
    label,
    name,
    value,
    onChange,
    disabled = false,
    fullWidth = true,
    sx = {},
    ...props
}) => {
    return (
        <Grid item xs={12}>
            <TextField
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                fullWidth={fullWidth}
                disabled={disabled}
                InputProps={{
                    style: { color: '#000' }, // Колір тексту в полі
                }}
                InputLabelProps={{
                    style: { color: '#000' }, // Колір лейблу
                }}
                sx={{ marginBottom: '10px', ...sx }}
                {...props}
            />
        </Grid>
    );
};

export default CustomTextField;

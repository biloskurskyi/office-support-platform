import React from 'react';
import { Typography } from '@mui/material';

const Title = () => (
    <Typography
        variant="h6"
        sx={{
            flexGrow: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: {
                xs: '0.9rem',
                sm: '1.2rem',
                md: '1.5rem',
            },
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)',
            color: '#ffffff',
        }}
    >
        Офісна Мозаїка
    </Typography>
);

export default Title;

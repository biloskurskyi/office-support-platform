// src/components/Header/UI/AuthButtons.tsx
import React from 'react';
import {Box, Button} from '@mui/material';
import {Link} from 'react-router-dom';

const AuthButtons = () => (
    <Box>
        <Link to="/login">
            <Button color="inherit" sx={{color: 'white'}}>Вхід</Button>
        </Link>
        <Link to="/signup">
            <Button color="inherit" sx={{color: 'white'}}>Реєстрація</Button>
        </Link>
    </Box>
);

export default AuthButtons;

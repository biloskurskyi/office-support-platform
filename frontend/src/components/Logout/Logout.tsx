import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = (): void => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user_type');
        navigate('/login');
    };

    return (
        <Button color="inherit" sx={{ color: 'white' }} onClick={handleLogout}>
            Вихід
        </Button>
    );
};

export default Logout;

import React from 'react';
import { Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const MenuButton = () => (
    <Button color="inherit" startIcon={<MenuIcon />}>
        Меню
    </Button>
);

export default MenuButton;

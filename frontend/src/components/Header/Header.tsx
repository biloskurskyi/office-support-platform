// src/components/Header/Header.tsx
import React from 'react';
import { AppBar, Toolbar } from '@mui/material';
import MenuButton from './UI/MenuButton';
import Title from './UI/Title';
import AuthButtons from './UI/AuthButtons';

const Header: React.FC = () => {
    return (
        <AppBar position="sticky" sx={{
            borderRadius: '14px',
            top: 10,
            marginBottom: 2,
            width: 'calc(100% - 20px)',
            marginLeft: '10px',
            marginRight: '10px',
            backgroundColor: '#596177'
        }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <MenuButton />
                <Title />
                <AuthButtons />
            </Toolbar>
        </AppBar>
    );
};

export default Header;

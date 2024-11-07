import React from 'react';
import {AppBar, Toolbar, Typography, Button, Box} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => {
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
            <Toolbar>
                <Button color="inherit" startIcon={<MenuIcon/>}>
                    Меню
                </Button>
                {/* Centered Typography */}
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1, // Make sure the Typography takes up available space
                        textAlign: 'center', // Center the text inside the Typography component
                    }}
                >
                    Офісна Мозаїка
                </Typography>
                <Button color="inherit">Вхід</Button>
                <Button color="inherit">Реєстрація</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;

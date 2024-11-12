import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const MenuButton: React.FC = () => {
    // Стан для контролю відкриття/закриття меню
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Функція для відкриття меню
    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    // Функція для закриття меню
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                color="inherit"
                startIcon={<MenuIcon />}
                onClick={handleMenuClick} // Відкриває меню
            >
                Меню
            </Button>

            {/* Випадаюче меню */}
            <Menu
                anchorEl={anchorEl} // Прив'язка меню до кнопки
                open={Boolean(anchorEl)} // Визначає, чи відкрите меню
                onClose={handleMenuClose} // Закриває меню
            >
                <MenuItem onClick={handleMenuClose}>Пункт 1</MenuItem>
                <MenuItem onClick={handleMenuClose}>Пункт 2</MenuItem>
                <MenuItem onClick={handleMenuClose}>Пункт 3</MenuItem>
            </Menu>
        </div>
    );
};

export default MenuButton;

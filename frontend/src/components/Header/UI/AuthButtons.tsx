import React from 'react';
import {Box, Button, IconButton} from '@mui/material';
import {Link} from 'react-router-dom';
import {AccountCircle} from '@mui/icons-material'; // Іконка для акаунту
import useAuth from '../../../hooks/useAuth'; // Хук для перевірки авторизації
import useMediaQuery from '@mui/material/useMediaQuery'; // Хук для перевірки ширини екрану
import Logout from '../../Logout/Logout.tsx';

const AuthButtons: React.FC = () => {
    const isAuthenticated = useAuth();
    const isSmallScreen = useMediaQuery('(max-width:700px)');

    return (
        <Box>
            {isAuthenticated ? (
                <>
                    {isSmallScreen ? (
                        // Якщо екран маленький, відображаємо іконку
                        <Link to="/account">
                            <IconButton color="inherit" sx={{color: 'white'}}>
                                <AccountCircle/>
                            </IconButton>
                        </Link>
                    ) : (
                        // Якщо екран більший, відображаємо текстову кнопку
                        <Link to="/account">
                            <Button color="inherit" sx={{color: 'white'}}>
                                Особистий акаунт
                            </Button>
                        </Link>
                    )}
                    <Logout/>
                </>
            ) : (
                <>
                    <Link to="/login">
                        <Button color="inherit" sx={{color: 'white'}}>Вхід</Button>
                    </Link>
                    <Link to="/signup">
                        <Button color="inherit" sx={{color: 'white'}}>Реєстрація</Button>
                    </Link>
                </>
            )}
        </Box>
    );
};

export default AuthButtons;

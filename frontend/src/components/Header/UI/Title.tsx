import React from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Title: React.FC = () => {
    const navigate = useNavigate();

    const handleTitleClick = () => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            navigate("/main"); // Перенаправляє на MainPage, якщо токен є
        } else {
            navigate("/home"); // Перенаправляє на HomePage, якщо токен відсутній
        }
    };

    return (
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
            onClick={handleTitleClick} // Додаємо обробник події на натискання
        >
            Офісна Мозаїка
        </Typography>
    );
};

export default Title;

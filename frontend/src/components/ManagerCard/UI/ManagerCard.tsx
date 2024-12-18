import React, {useState} from 'react';
import {Button, Link, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import axios from "axios";

interface ManagerCardProps {
    manager: {
        id: number;
        surname: string,
        name: string,
        email: string,
        user_type: number,
        info: string,
        company: number
        is_active: boolean;
    };
}


const ManagerCard: React.FC<ManagerCardProps> = ({manager}) => {
    const [isActive, setIsActive] = useState(manager.is_active);
    const [loading, setLoading] = useState(false);

    const handleToggleActive = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                alert("Ви не авторизовані.");
                return;
            }

            const response = await axios.post(
                `http://localhost:8765/api/change-manager-status/${manager.id}/`,
                {},
                {
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            setIsActive(response.data.is_active); // Оновлюємо статус активності
            alert(`Статус менеджера змінено на ${response.data.is_active ? 'активний' : 'неактивний'}.`);
        } catch (error) {
            console.error("Помилка під час оновлення статусу менеджера:", error);
            alert("Не вдалося оновити статус менеджера. Спробуйте пізніше.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <p><strong>Прізвище:</strong> {manager.surname}</p>
            <p><strong>Ім'я:</strong> {manager.name}</p>
            <p><strong>Електрона адреса:</strong> {manager.email}</p>
            <p><strong>Інформація:</strong> {manager.info}</p>
            <Typography variant="body2" color={isActive ? 'green' : 'red'} gutterBottom>
                <strong>Статус:</strong> {isActive ? 'Активний' : 'Неактивний'}
            </Typography>
            <Button
                variant="contained"
                color={isActive ? 'secondary' : 'primary'}
                onClick={handleToggleActive}
                disabled={loading}
                sx={{
                    marginTop: '8px',
                    backgroundColor: isActive ? '#808080' : '#1976d2',
                    '&:hover': {
                        backgroundColor: isActive ? '#c62828' : '#2e7d32',
                    },
                }}
            >
                {loading ? 'Оновлення...' : isActive ? 'Деактивувати' : 'Активувати'}
            </Button>
        </div>
    );
};

export default ManagerCard;
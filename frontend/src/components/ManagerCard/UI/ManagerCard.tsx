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
                `http://localhost:8000/api/change-manager-status/${manager.id}/`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setIsActive(response.data.is_active); // Оновлюємо статус активності
            alert("Статус менеджера оновлено успішно.");
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
            <p><strong>Електрона пошта:</strong> {manager.email}</p>
            <p><strong>Інформація:</strong> {manager.info}</p>

        </div>
    );
};

export default ManagerCard;
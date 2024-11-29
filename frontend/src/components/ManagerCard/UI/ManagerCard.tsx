import React from 'react';
import {Button, Link, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";

interface ManagerCardProps {
    manager: {
        id: number;
        surname: string,
        name: string,
        email: string,
        user_type: number,
        info: string,
        company: number
    };
}


const ManagerCard: React.FC<ManagerCardProps> = ({manager}) => {
    return (
        <div>
            <p><strong>Прізвище:</strong> {manager.surname}</p>
            <p><strong>Ім'я:</strong> {manager.name}</p>
            <p><strong>Електрона пошта:</strong> {manager.email}</p>
            <p><strong>Інформація:</strong> {manager.info}</p>
            <Link to={`/main`} component={RouterLink} style={{textDecoration: 'none'}}> {/*тут змінити посилання*/}
                <Button
                    variant="outlined"
                    sx={{
                        marginTop: '16px',
                        padding: '6px 16px',
                        fontSize: '0.875rem',
                        borderRadius: '4px',
                        borderColor: '#000',
                        color: '#000',
                        '&:hover': {
                            borderColor: '#333',
                            backgroundColor: '#f5f5f5',
                        },
                    }}
                >
                    Переглянути сторінку менеджера
                </Button>
            </Link>
        </div>
    );
};

export default ManagerCard;
// components/OfficeCard.tsx
import React from 'react';
import { Button, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface OfficeCardProps {
    office: {
        id: number;
        city: string;
        address: string;
        country: string;
        postal_code: string;
        phone_number: string;
    };
}

const OfficeCard: React.FC<OfficeCardProps> = ({ office }) => {
    return (
        <div>
            <Typography variant="h6">{office.city}</Typography>
            <p><strong>Адреса:</strong> {office.address}</p>
            <p><strong>Країна:</strong> {office.country}</p>
            <p><strong>Поштовий індекс:</strong> {office.postal_code}</p>
            <p><strong>Телефон:</strong> {office.phone_number}</p>
            <Link to={`/office/${office.id}`} component={RouterLink} style={{ textDecoration: 'none' }}>
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
                    Переглянути сторінку
                </Button>
            </Link>
        </div>
    );
};

export default OfficeCard;

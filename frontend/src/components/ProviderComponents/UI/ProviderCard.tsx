import React from 'react';
import {Button, Link, Typography} from '@mui/material';
import {Link as RouterLink} from 'react-router-dom';

interface ProviderCardProps {
    provider: {
        id: number;
        name: string;
        address: string;
        phone_number: string;
        email: string;
        company: string;
        bank_details: string
    }
}

const ProviderCard: React.FC<ProviderCardProps> = ({provider}) => {
    return (
        <div>
            <p><strong>Адреса:</strong> {provider.address}</p>
            <p><strong>Електрона пошта:</strong> {provider.email}</p>
            <p><strong>Телефон:</strong> {provider.phone_number}</p>
            <p><strong>Банківські реквізити:</strong> {provider.bank_details}</p>
            <Link to={`/main`} component={RouterLink} style={{textDecoration: 'none'}}>
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

export default ProviderCard;
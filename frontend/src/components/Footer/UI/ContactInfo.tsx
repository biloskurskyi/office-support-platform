// src/components/Footer/UI/ContactInfo.tsx
import React from 'react';
import { Typography } from '@mui/material';

const ContactInfo = () => (
    <>
        <Typography variant="h6" textAlign="center" gutterBottom>
            Зв'яжіться з нами
        </Typography>
        <Typography textAlign="center">
            Email: contact@yourapp.com | Phone: +123 456 7890
        </Typography>
    </>
);

export default ContactInfo;

// src/components/Footer/UI/SocialIcons.tsx
import React from 'react';
import { Stack, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const SocialIcons = () => (
    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <IconButton color="inherit" aria-label="Facebook" href="https://facebook.com" target="_blank">
            <FacebookIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="Instagram" href="https://instagram.com" target="_blank">
            <InstagramIcon />
        </IconButton>
        <IconButton color="inherit" aria-label="LinkedIn" href="https://linkedin.com" target="_blank">
            <LinkedInIcon />
        </IconButton>
    </Stack>
);

export default SocialIcons;

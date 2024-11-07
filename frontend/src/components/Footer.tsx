import React from 'react';
import {Box, Typography, Stack, IconButton} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                color: 'white',
                py: 3,
                px: 2,
                mt: 'auto',
                borderRadius: '14px',
                marginLeft: '10px',
                marginRight: '10px',
                position: 'relative',  // додаємо позиціонування
                marginBottom: '10px',  // додатковий відступ для футера
                backgroundColor: '#596177'
            }}
        >
            {/* Contact Info */}
            <Typography variant="h6" textAlign="center" gutterBottom>
                Зв'яжіться з нами
            </Typography>
            <Typography textAlign="center">
                Email: contact@yourapp.com | Phone: +123 456 7890
            </Typography>

            {/* Social Media Icons */}
            <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                sx={{mt: 2}}
            >
                <IconButton
                    color="inherit"
                    aria-label="Facebook"
                    href="https://facebook.com"
                    target="_blank"
                >
                    <FacebookIcon/>
                </IconButton>
                <IconButton
                    color="inherit"
                    aria-label="Instagram"
                    href="https://instagram.com"
                    target="_blank"
                >
                    <InstagramIcon/>
                </IconButton>
                <IconButton
                    color="inherit"
                    aria-label="LinkedIn"
                    href="https://linkedin.com"
                    target="_blank"
                >
                    <LinkedInIcon/>
                </IconButton>


            </Stack>
            <Typography variant="body2" textAlign="center" sx={{mt: 2}}>
                © {new Date().getFullYear()} Офісна Мозаїка. Всі права захищені.
            </Typography>
        </Box>
    );
};

export default Footer;

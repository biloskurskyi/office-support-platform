// src/components/Footer/Footer.tsx
import React from 'react';
import { Box } from '@mui/material';
import ContactInfo from './UI/ContactInfo';
import SocialIcons from './UI/SocialIcons';
import Copyright from './UI/Copyright';

const Footer: React.FC = () => {
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
        position: 'relative',
        marginBottom: '10px',
        backgroundColor: '#596177',
      }}
    >
      <ContactInfo />
      <SocialIcons />
      <Copyright />
    </Box>
  );
};

export default Footer;

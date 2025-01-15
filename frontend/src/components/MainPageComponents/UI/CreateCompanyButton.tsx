import React from 'react';
import { Button } from '@mui/material';

const commonButtonStyles = {
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: '10px 20px',
  borderRadius: '20px',
  margin: '10px',
};

const CreateCompanyButton = () => {
  return (
    <Button
      variant="contained"
      sx={{
        ...commonButtonStyles,
        backgroundColor: '#4caf50', // Світло-зелений колір
        color: '#ffffff',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Легкий тіньовий ефект
        '&:hover': {
          backgroundColor: '#388e3c', // Трохи темніший зелений при наведенні
          boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.3)', // Посилений тіньовий ефект
        },
      }}
    >
      Створити компанію
    </Button>
  );
};


export default CreateCompanyButton;

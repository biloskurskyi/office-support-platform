import React from 'react';
import { Button } from '@mui/material';

const CreateCompanyButton = () => {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{
        marginTop: '15px',
        padding: '10px 20px',
        fontSize: '1rem',
        borderRadius: '20px',
        marginBottom: '100px',
        backgroundColor: '#4867d8',
        '&:hover': {
          backgroundColor: '#1d3caf',
        },
      }}
    >
      Створити компанію
    </Button>
  );
};

export default CreateCompanyButton;

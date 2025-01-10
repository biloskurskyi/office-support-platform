import React from 'react';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const ChangePassword = () => {
  return (
    <Link
      to="/change-password"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '30px',
        }}
      >
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{
            backgroundColor: '#f44336',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#d32f2f',
            },
          }}
        >
          Змінити пароль
        </Button>
      </Box>
    </Link>
  );
};

export default ChangePassword;

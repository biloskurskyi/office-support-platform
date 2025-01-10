import React from 'react';
import { Box, Button } from '@mui/material';

const ChangePasswordButton = () => {
  return (
    <Box sx={{ marginTop: '20px', marginBottom: '20px' }}>
      <Button variant="contained" color="primary" fullWidth type="submit">
        Змінити пароль
      </Button>
    </Box>
  );
};

export default ChangePasswordButton;

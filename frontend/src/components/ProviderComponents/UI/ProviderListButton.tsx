import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material';

interface ProviderListButtonProps {
  id: string;
}

const ProviderListButton: React.FC<ProviderListButtonProps> = ({ id }) => {
  return (
    <Link to={`/provider-list/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{
            backgroundColor: '#58d68d',
            color: '#fff',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#1d8348',
            },
          }}
        >
          Перелік постачальників
        </Button>
      </Box>
    </Link>
  );
};

export default ProviderListButton;

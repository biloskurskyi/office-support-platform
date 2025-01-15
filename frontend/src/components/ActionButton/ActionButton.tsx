import React from 'react';
import { Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

interface ActionButtonProps {
  to: string;
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ to, label }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#4caf50',
            color: '#ffffff',
            padding: '10px 20px',
            fontWeight: 'bold',
            borderRadius: '8px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              backgroundColor: '#388e3c',
            },
          }}
        >
          {label}
        </Button>
      </CardActions>
    </Link>
  );
};

export default ActionButton;

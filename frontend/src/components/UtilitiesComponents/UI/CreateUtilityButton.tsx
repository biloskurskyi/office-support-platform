import React from 'react';
import { Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

interface Props {
  officeId: string | undefined;
}

const CreateUtilityButton: React.FC<Props> = ({ officeId }) => {
  return (
    <Link
      to={`/utility-create/${officeId}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: '#1976d2',
          color: '#fff',
          fontWeight: 'bold',
          width: '280px',
          '&:hover': {
            backgroundColor: '#155a9c',
          },
        }}
      >
        Створити комунальну послугу
      </Button>
    </Link>
  );
};

export default CreateUtilityButton;

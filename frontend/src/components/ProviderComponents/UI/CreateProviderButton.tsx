import React from 'react';
import { Link } from 'react-router-dom';
import { Button, CardActions } from '@mui/material';

interface Props {
  companyId: string | undefined;
}

const CreateProviderButton: React.FC<Props> = ({ companyId }) => {
  return (
    <Link
      to={`/provider-create/${companyId}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <CardActions sx={{ justifyContent: 'center' }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#155a9c',
            },
          }}
        >
          Створити постачальника
        </Button>
      </CardActions>
    </Link>
  );
};

export default CreateProviderButton;

import React from 'react';
import { Button, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

interface Props {
  companyId: string | undefined;
}

const CreateOfficeButton: React.FC<Props> = ({ companyId }) => {
  return (
    <Link
      to={`/office-create/${companyId}`}
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
          Створити офіс
        </Button>
      </CardActions>
    </Link>
  );
};

export default CreateOfficeButton;

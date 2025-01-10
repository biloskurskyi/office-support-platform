import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import FormPaper from '../../components/LoginForm/UI/FormPaper.tsx';
import CustomTextField from '../../components/UserForm/UI/CustomTextField.tsx';
import UpdateButton from '../../components/UserForm/UI/UpdateButton.tsx';

interface ProviderFormProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (event: React.FormEvent) => void;
  successMessage: string | null;
  errorMessage: string | null;
  provider: any;
}

const ProviderForm: React.FC<ProviderFormProps> = ({
  formData,
  setFormData,
  handleSubmit,
  successMessage,
  errorMessage,
  provider,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
      }}
    >
      <FormPaper title="Оновити дані">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <CustomTextField
              label="Назва"
              value={formData.name}
              name="name"
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <CustomTextField
              label="Адреса"
              value={formData.address}
              name="address"
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <CustomTextField
              label="Номер телефону"
              value={formData.phone_number}
              name="phone_number"
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <CustomTextField
              label="Електроний лист"
              value={formData.email}
              name="email"
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <CustomTextField
              label="Банківські реквізити"
              value={formData.bank_details}
              name="bank_details"
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <CustomTextField
              label="Компанія"
              value={formData.company}
              name="company"
              disabled
            />
          </Grid>

          {successMessage && (
            <Typography color="success.main" sx={{ marginTop: '10px' }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography color="error.main" sx={{ marginTop: '10px' }}>
              {errorMessage}
            </Typography>
          )}

          <UpdateButton />
        </form>

        <hr />

        <Link
          to={`/provider-list/${provider.company_id}`}
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
      </FormPaper>
    </Box>
  );
};

export default ProviderForm;

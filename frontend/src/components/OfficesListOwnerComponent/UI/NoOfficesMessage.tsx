import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import CreateOfficeButton from '../../OfficesListOwnerComponent/UI/CreateOfficeButton';

interface NoOfficesMessageProps {
  companyId: string | undefined;
}

const NoOfficesMessage: React.FC<NoOfficesMessageProps> = ({ companyId }) => {
  return (
    <>
      <div style={{ height: '400px' }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          textAlign: 'center',
          color: '#555',
        }}
      >
        <Card
          sx={{
            maxWidth: 400,
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="div"
              sx={{ marginBottom: '16px', fontWeight: 'bold', color: '#333' }}
            >
              Офіси не знайдено
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Здається, у цієї компанії ще немає офісів. Ви можете створити
              новий офіс за допомогою кнопки нижче.
            </Typography>
          </CardContent>
          <CreateOfficeButton companyId={companyId} />
        </Card>
      </Box>
    </>
  );
};

export default NoOfficesMessage;

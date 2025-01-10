import React, { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorPage = () => {
  const { setText } = useOutletContext<{
    setText: (text: React.ReactNode) => void;
  }>();

  useEffect(() => {
    setText(<h2>Помилка доступу</h2>);
  }, [setText]);

  const navigate = useNavigate();

  return (
    <>
      <div style={{ height: '400px' }} />
      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          textAlign="center"
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 3,
            boxShadow: 3,
            bgcolor: 'background.paper',
          }}
        >
          {/* Іконка помилки */}
          <ErrorOutlineIcon color="error" sx={{ fontSize: 50, mb: 1 }} />

          {/* Заголовок */}
          <Typography variant="h5" component="h1" gutterBottom>
            Щось пішло не так
          </Typography>

          {/* Опис */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Ми працюємо над вирішенням проблеми. Спробуйте пізніше.
          </Typography>

          {/* Кнопка повернення */}
          <Button
            variant="contained"
            sx={{
              textTransform: 'none',
              px: 3,
              bgcolor: '#6c757d', // Кастомний сірий колір
              color: '#fff', // Білий текст
              '&:hover': {
                bgcolor: '#5a6268', // Темніший сірий для ховера
              },
            }}
            onClick={() => navigate('/main')}
          >
            Повернутися на головну
          </Button>
        </Box>
      </Container>
      <div style={{ height: '50px' }} />
    </>
  );
};

export default ErrorPage;

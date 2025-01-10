// src/components/Footer/UI/Copyright.tsx
import React from 'react';
import { Typography } from '@mui/material';

const Copyright: React.FC = () => (
  <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
    © {new Date().getFullYear()} Офісна Мозаїка. Всі права захищені.
  </Typography>
);

export default Copyright;

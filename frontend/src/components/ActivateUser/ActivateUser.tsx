import React, { useEffect, useState, useRef } from 'react';
import type { AxiosResponse } from 'axios';
import api from '../../api/client';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';

const ActivateUser = () => {
  const { id }: { id: string } = useParams();
  const [activationStatus, setActivationStatus] = useState<string | null>(
    'Активація користувача...'
  );
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const activateUser = async () => {
      try {
        const response = await api.get(
          `/activate/${id}/`
        );
        setActivationStatus(response.data.message);
      } catch (error) {
        console.error('Error activating user:', error);
        setActivationStatus('Даруйте, виникла помилка, спробуйте згодом...');
      }
    };

    activateUser();
  }, [id]);

  console.log(activationStatus);

  return (
    <Typography
      variant="h5"
      color={
        activationStatus.includes('Error') ||
        activationStatus.includes('помилка')
          ? 'error'
          : 'success'
      }
    >
      {activationStatus}
    </Typography>
  );
};

export default ActivateUser;

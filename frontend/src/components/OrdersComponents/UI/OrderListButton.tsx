import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@mui/material';

interface OrderListButtonProps {
  id: string;
}

const OrderListButton: React.FC<OrderListButtonProps> = ({ id }) => {
  return (
    <Link
      to={`/order-list/${id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}
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
          Перелік замовлень для офісу
        </Button>
      </Box>
    </Link>
  );
};

export default OrderListButton;

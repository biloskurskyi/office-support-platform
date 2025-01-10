import React from 'react';
import { Button, Typography } from '@mui/material';
import { Link, Link as RouterLink } from 'react-router-dom';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface OrderCardProps {
  order: {
    id: number;
    title: string;
    description: string;
    deal_value: number;
    currency_name: string;
    file: string;
    provider_name: number;
    office_phone_number: number;
    provider_id: number;
  };
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const handleFileDownload = () => {
    const baseUrl = 'http://localhost:8765/';
    const fileUrl = `${baseUrl}${order.file}`;
    console.log(fileUrl);

    // Створюємо посилання для завантаження файлу
    const fileLink = document.createElement('a');
    fileLink.href = fileUrl;
    fileLink.download = order.file.split('/').pop() || 'file.pdf';
    fileLink.target = '_blank';
    document.body.appendChild(fileLink);
    fileLink.click();
    document.body.removeChild(fileLink);
  };

  return (
    <div>
      <p>
        <strong>Опис:</strong> {order.description}
      </p>
      <p>
        <strong>Вартість угоди:</strong> {order.deal_value}
      </p>
      <p>
        <strong>Валюта:</strong> {order.currency_name}
      </p>
      <Typography>
        <strong>Звіт:</strong>{' '}
        <Button
          startIcon={<PictureAsPdfIcon />}
          onClick={handleFileDownload}
          sx={{
            textTransform: 'none',
            color: '#d32f2f',
          }}
        >
          Завантажити файл
        </Button>
      </Typography>
      <p>
        <strong>Постачальник замовлення: </strong>
        <Link to={`/provider/${order.provider_id}`}>{order.provider_name}</Link>
      </p>
      <p>
        <strong>Номер телефону офісу:</strong> {order.office_phone_number}
      </p>
      <Link
        to={`/order/${order.id}`}
        component={RouterLink}
        style={{ textDecoration: 'none' }}
      >
        <Button
          variant="outlined"
          sx={{
            marginTop: '16px',
            padding: '6px 16px',
            fontSize: '0.875rem',
            borderRadius: '4px',
            borderColor: '#000',
            color: '#000',
            '&:hover': {
              borderColor: '#333',
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          Переглянути сторінку
        </Button>
      </Link>
    </div>
  );
};

export default OrderCard;

import React from 'react';
import { Paper, Typography, Button } from '@mui/material';

interface InfoBlockProps {
  title: string;
  content: React.ReactNode;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ title, content }) => {
  // Обгортаємо content в <div>, щоб уникнути проблеми з вкладеними <p> тегами
  const renderContent = React.isValidElement(content) ? (
    content
  ) : (
    <Typography>{content}</Typography>
  );

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: '100%',
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{
          borderBottom: '2px solid #ccc',
          paddingBottom: '8px',
          marginBottom: '12px',
        }}
      >
        {title}
      </Typography>
      {renderContent}
    </Paper>
  );
};

export default InfoBlock;

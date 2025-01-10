import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import InfoBlock from './InfoBlock';
import CreateCompanyButton from './CreateCompanyButton.tsx';

interface Block {
  title: string;
  content: React.ReactNode;
}

interface InfoBlocksProps {
  blocksData: Block[] | null;
}

const InfoBlocks: React.FC<InfoBlocksProps> = ({ blocksData }) => {
  if (!blocksData) {
    return (
      <Typography
        variant="h6"
        sx={{ marginTop: '20px', textAlign: 'center', color: '#555' }}
      >
        Інформація про компанії або офіси наразі відсутня. <br />
        Почніть свій шлях до ефективного управління — створіть компанію прямо
        зараз,
        <br />
        або зачекайте на отримання прав доступу до офісу! <br />
        {/*<CreateCompanyButton/>*/}
        <div style={{ height: '100px' }} />
      </Typography>
    );
  }

  return (
    <>
      <Box
        sx={{
          padding: '0 10px',
          marginBottom: '100px',
          display: 'flex',
          justifyContent: blocksData.length === 1 ? 'center' : 'flex-start',
          alignItems: blocksData.length === 1 ? 'center' : 'flex-start',
        }}
      >
        <Grid
          container
          spacing={6}
          justifyContent={blocksData.length === 1 ? 'center' : 'flex-start'}
        >
          {blocksData.map((block, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <InfoBlock title={block.title} content={block.content} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default InfoBlocks;

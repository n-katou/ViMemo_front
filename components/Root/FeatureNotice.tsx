import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

interface FeatureNoticeProps {
  isLightTheme: boolean;
}

const FeatureNotice: React.FC<FeatureNoticeProps> = ({ isLightTheme }) => {
  return (
    <Box
      sx={{
        backgroundColor: isLightTheme ? '#e3f2fd' : '#c084fc',
        padding: '15px 25px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        marginBottom: 4,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        maxWidth: '500px',
        margin: '0 auto',
      }}
    >
      <InfoIcon sx={{ fontSize: '2rem', color: isLightTheme ? '#38bdf8' : 'white' }} />
      <Box>
        <Typography variant="h5" sx={{ color: isLightTheme ? '#38bdf8' : 'white', fontWeight: 'bold' }}>
          機能説明
        </Typography>
        <Typography variant="body1" sx={{ color: isLightTheme ? '#38bdf8' : 'white' }}>
          下のタブをクリックしたら各機能の詳細を確認できます
        </Typography>
      </Box>
    </Box>
  );
};

export default FeatureNotice;

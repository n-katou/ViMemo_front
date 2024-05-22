import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';
import InfoIcon from '@mui/icons-material/Info';
import { useFlashMessage } from '../context/FlashMessageContext';

const FlashMessage = () => {
  const { message } = useFlashMessage();

  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={3000}
      TransitionComponent={Fade}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        '.MuiSnackbarContent-root': {
          backgroundColor: '#444',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          padding: '16px',
        },
      }}
    >
      <Alert
        icon={<InfoIcon fontSize="inherit" />}
        severity="info"
        sx={{
          width: '100%',
          backgroundColor: '#2126f3',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '8px',
          border: '1px solid #1976d2',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default FlashMessage;

import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useFlashMessage } from '../context/FlashMessageContext';

const FlashMessage = () => {
  const { message } = useFlashMessage();

  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        '.MuiSnackbarContent-root': {
          backgroundColor: '#333',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '8px',
        },
      }}
    >
      <Alert
        severity="info"
        sx={{
          width: '100%',
          backgroundColor: '#1976d2',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default FlashMessage;

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
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          padding: '16px',
          transition: 'all 0.3s ease',
        },
      }}
    >
      <Alert
        icon={<InfoIcon fontSize="inherit" />}
        severity="info"
        sx={{
          width: '100%',
          background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '8px',
          border: '1px solid #1976d2',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s ease',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default FlashMessage;

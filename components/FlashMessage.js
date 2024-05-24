import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useFlashMessage } from '../context/FlashMessageContext';

const FlashMessage = () => {
  const { message, setFlashMessage } = useFlashMessage();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const flashMessage = query.get('flash_message');

    if (flashMessage) {
      setFlashMessage(decodeURIComponent(flashMessage));
      query.delete('flash_message');
      const newQuery = query.toString();
      const newUrl = window.location.pathname + (newQuery ? `?${newQuery}` : '');
      router.replace(newUrl, undefined, { shallow: true });
    }

    if (message) {
      setOpen(true);
    }
  }, [message, setFlashMessage, router]);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity="info">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default FlashMessage;

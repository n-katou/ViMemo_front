import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

interface FlashMessageContextType {
  setFlashMessage: (msg: string, sev?: 'info' | 'success' | 'warning' | 'error') => void;
}

const FlashMessageContext = createContext<FlashMessageContextType | undefined>(undefined);

export const FlashMessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'info' | 'success' | 'warning' | 'error'>('info');
  const [open, setOpen] = useState(false);

  const setFlashMessage = useCallback((msg: string, sev: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
    setTimeout(() => setOpen(false), 3000); // 3秒後にメッセージをクリア
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <FlashMessageContext.Provider value={{ setFlashMessage }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 上部中央に設定
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessage = () => {
  const context = useContext(FlashMessageContext);
  if (!context) {
    throw new Error('useFlashMessage must be used within a FlashMessageProvider');
  }
  return context;
};

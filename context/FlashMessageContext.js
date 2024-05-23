import React, { createContext, useContext, useState, useCallback } from 'react';

const FlashMessageContext = createContext();

export const FlashMessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  const setFlashMessage = useCallback((msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000); // 3秒後にメッセージをクリア
  }, []);

  return (
    <FlashMessageContext.Provider value={{ message, setFlashMessage }}>
      {children}
    </FlashMessageContext.Provider>
  );
};

export const useFlashMessage = () => useContext(FlashMessageContext);

import React, { useState, useEffect } from 'react';
import { Fab } from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ScrollButtons: React.FC = () => {
  const [isAtTop, setIsAtTop] = useState(true);

  // スクロール位置を監視し、ボタンの表示を切り替える
  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY < 100; // 100px未満なら「最上へ」ボタンを非表示
      setIsAtTop(isTop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // スクロール処理
  const handleScroll = () => {
    if (isAtTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
      }}
    >
      <motion.div whileHover={{ scale: 1.1 }}>
        <Fab
          onClick={handleScroll}
          sx={{
            backgroundColor: isAtTop ? '#22eec5' : '#38bdf8',
            color: 'white',
            '&:hover': {
              backgroundColor: isAtTop ? '#1bb89a' : '#1e90ff',
            },
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          }}
        >
          {isAtTop ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
        </Fab>
      </motion.div>
    </div>
  );
};

export default ScrollButtons;

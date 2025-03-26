import React from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingSpinnerProps {
  loading: boolean;
  size?: number;
  bgColor?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  loading,
  size = 100,
  bgColor = 'rgba(0, 0, 0, 0.8)', // 少し透けた背景に
}) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const spinnerImage = isDarkMode ? '/black_spinner.gif' : '/white_spinner.gif';

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="loading-spinner"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: bgColor,
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="text-center"
          >
            <img
              src={spinnerImage}
              alt="Loading..."
              style={{
                width: size,
                height: size,
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
            <p className="mt-6 text-white text-xl md:text-2xl font-semibold drop-shadow-lg">
              Loading...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingSpinner;

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
  size = 80,
  bgColor = 'rgba(0, 0, 0, 0.6)',
}) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  const spinnerColor = isDarkMode ? '#fff' : '#333';

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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4"
          >
            {/* スタイリッシュなアニメーションリング */}
            <div
              className="rounded-full animate-spin"
              style={{
                width: size,
                height: size,
                border: `4px solid ${spinnerColor}`,
                borderTop: `4px solid transparent`,
                borderRadius: '50%',
              }}
            />
            {/* テキストアニメーション */}
            <motion.p
              className="text-white text-lg md:text-xl font-medium tracking-wide"
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              読み込み中...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingSpinner;

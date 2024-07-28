import { styled } from '@mui/system';
import { ToggleButton } from '@mui/material';
import { useTheme } from 'next-themes';

export const useCustomToggleButtonStyles = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return {
    backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb', // 非選択時の背景色
    color: isDarkMode ? '#e5e7eb' : '#1f2937', // 非選択時のテキスト色
    '&.Mui-selected': {
      backgroundColor: isDarkMode ? '#6366f1' : '#818cf8',
      color: 'white',
      '&:hover': {
        backgroundColor: isDarkMode ? '#818cf8' : '#6366f1',
      },
    },
    '&:hover': {
      backgroundColor: isDarkMode ? '#2d3748' : '#d1d5db',
    },
  };
};

export const CustomToggleButton = styled(ToggleButton)(useCustomToggleButtonStyles);

export const useSnackbarStyles = () => ({
  top: '20px',
  width: '90%',
  maxWidth: '600px',
  left: '50%',
  transform: 'translateX(-50%)',
  p: 2, // パディングを追加
  '@media (max-width: 600px)': {
    width: '90%',
    fontSize: '0.875rem',
    padding: '8px', // モバイルでのパディングを追加
  }
});

export const useAlertStyles = () => ({
  width: '100%',
  fontSize: '1rem',
  fontWeight: 'bold',
  boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  '@media (max-width: 600px)': {
    fontSize: '0.875rem' // モバイルでのフォントサイズを調整
  }
});

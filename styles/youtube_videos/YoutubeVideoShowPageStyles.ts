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

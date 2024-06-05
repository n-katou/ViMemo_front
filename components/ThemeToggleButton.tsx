import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import IconButton from '@mui/material/IconButton';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { SxProps, Theme } from '@mui/system';

interface ThemeToggleButtonProps {
  sx?: SxProps<Theme>;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ sx }) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleToggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);

    // ルートパスの場合のみリロード
    if (router.pathname === '/') {
      window.location.reload();
    }
  };

  return (
    <Box display="flex" alignItems="center" gap={2} sx={sx} onClick={handleToggleTheme} style={{ cursor: 'pointer' }}>
      <IconButton color="inherit">
        {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
      <Typography>
        テーマ切り替え
      </Typography>
    </Box>
  );
}

export default ThemeToggleButton;

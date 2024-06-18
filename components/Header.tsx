import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SearchDialog from './Header/SearchDialog';
import UserDrawer from './Header/UserDrawer';
import FlashMessage from '../components/FlashMessage';
import { useFlashMessage } from '../context/FlashMessageContext';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { setFlashMessage } = useFlashMessage();
  const { theme, resolvedTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isMessageDisplayed = localStorage.getItem('isMessageDisplayed');
    if (isMessageDisplayed === 'true') {
      setFlashMessage('ロード中です。');
    }

    const handleRouteChange = () => {
      setDrawerOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [setFlashMessage, router.events]);

  const handleLogout = async () => {
    try {
      await logout();
      setDrawerOpen(false);
      localStorage.setItem('isMessageDisplayed', 'false');
      router.push('/login?flash_message=ログアウトしました');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const navigateToYoutubeVideos = () => {
    router.push('/youtube_videos');
  };

  const navigateToHome = () => {
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: resolvedTheme === 'light' ? 'white' : 'black', zIndex: 1300 }}>
        <Toolbar>
          <span
            className="bg-gradient-rainbow-header"
            onClick={navigateToHome}
            style={{
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: 'Volkhov',
                fontWeight: 600,
                fontSize: {
                  xs: '1.5rem',
                  sm: '3.0rem',
                  md: '3.5rem',
                },
              }}
            >
              ViMemo
            </Typography>
          </span>
          <div style={{ flexGrow: 1 }} />
          <div className="flex items-center">
            <IconButton
              onClick={toggleSearch}
              sx={{
                color: '#818cf8',
                fontFamily: 'Volkhov',
                '&:hover': {
                  color: '#818cf8',
                  transform: 'scale(1.1)',
                  transition: 'transform 0.3s ease',
                }
              }}
            >
              <SearchIcon />
              <Typography variant="body1" sx={{ marginLeft: 0.5, color: '#c084fc', '&:hover': { color: '#818cf8' } }}>
                検索
              </Typography>
            </IconButton>
            <SearchDialog searchOpen={searchOpen} toggleSearch={toggleSearch} />
          </div>
          <Button
            onClick={navigateToYoutubeVideos}
            startIcon={<YouTubeIcon className="youtube-icon" />}
            sx={{
              color: '#818cf8',
              fontFamily: 'Volkhov',
              '&:hover': {
                color: '#818cf8',
                transform: 'scale(1.1)',
                transition: 'transform 0.3s ease',
              }
            }}
          >
            <Typography variant="body1" sx={{ marginLeft: 0.5, color: '#c084fc', '&:hover': { color: '#818cf8' } }}>
              YouTube
            </Typography>
          </Button>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer}
              sx={{
                color: '#818cf8',
                '&:hover': {
                  color: '#c084fc',
                  transform: 'scale(1.1)',
                  transition: 'transform 0.3s ease',
                }
              }}
            >
              <AccountCircle />
            </IconButton>
            <UserDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} currentUser={currentUser} handleLogout={handleLogout} />
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <FlashMessage />
    </>
  );
};

export default Header;

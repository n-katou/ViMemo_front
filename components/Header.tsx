import React, { useState, useEffect, useRef } from 'react';
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
  const { resolvedTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerTimeout = useRef<NodeJS.Timeout | null>(null);

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

  // ホバーで `UserDrawer` を開く処理
  const handleMouseEnter = () => {
    if (drawerTimeout.current) {
      clearTimeout(drawerTimeout.current);
    }
    setDrawerOpen(true);
  };

  // ホバーが外れた時に少し遅らせて閉じる処理
  const handleMouseLeave = () => {
    drawerTimeout.current = setTimeout(() => {
      setDrawerOpen(false);
    }, 300);
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
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: resolvedTheme === 'light' ? 'white' : 'black',
          zIndex: 1300,
        }}
      >
        <Toolbar>
          <span
            className="bg-gradient-rainbow-header"
            onClick={navigateToHome}
            style={{ cursor: 'pointer', display: 'inline-block' }}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: 'Volkhov',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', sm: '3.0rem', md: '3.5rem' },
              }}
            >
              ViMemo
            </Typography>
          </span>
          <div style={{ flexGrow: 1 }} />

          <IconButton onClick={toggleSearch} sx={{ color: '#818cf8' }}>
            <SearchIcon />
            <Typography variant="body1" sx={{ marginLeft: 0.5, color: '#c084fc' }}>
              検索
            </Typography>
          </IconButton>
          <SearchDialog searchOpen={searchOpen} toggleSearch={toggleSearch} />

          <Button
            onClick={navigateToYoutubeVideos}
            startIcon={<YouTubeIcon className="youtube-icon" />}
            sx={{ color: '#818cf8', fontWeight: 'bold' }}
          >
            YouTube
          </Button>

          {/* アカウントアイコン（ホバーで開く） */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'inline-block', position: 'relative' }}
          >
            <IconButton
              size="large"
              sx={{
                color: '#818cf8',
                '&:hover': {
                  color: '#c084fc',
                  transform: 'scale(1.1)',
                  transition: 'transform 0.3s ease',
                },
              }}
            >
              <AccountCircle />
            </IconButton>
            <UserDrawer
              drawerOpen={drawerOpen}
              toggleDrawer={() => setDrawerOpen(!drawerOpen)}
              currentUser={currentUser}
              handleLogout={handleLogout}
              onMouseEnter={handleMouseEnter} // `UserDrawer` 内にマウスがある間は閉じない
              onMouseLeave={handleMouseLeave} // `UserDrawer` 外にマウスが出たら閉じる
            />
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <FlashMessage />
    </>
  );
};

export default Header;

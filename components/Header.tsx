import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';

import AppBar from '@mui/material/AppBar';
import { useMediaQuery } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AccountCircle from '@mui/icons-material/AccountCircle';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SearchIcon from '@mui/icons-material/Search';

import { useAuth } from '../context/AuthContext';
import { useFlashMessage } from '../context/FlashMessageContext';

import FlashMessage from '../components/FlashMessage';

import UserDrawer from './Header/UserDrawer';
import SearchDialog from './Header/SearchDialog';
import SearchBox from './Header/SearchBox';


const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { setFlashMessage } = useFlashMessage();
  const { resolvedTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerTimeout = useRef<NodeJS.Timeout | null>(null);
  const [query, setQuery] = useState('');

  // スマホ判定
  const isMobile = useMediaQuery('(max-width: 768px)');

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

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);  // ログアウトボタン押下時にフラグをON
      setDrawerOpen(false);   // ドロワーを閉じる
      localStorage.setItem('isMessageDisplayed', 'false');

      await logout();

      router.push('/login?flash_message=ログアウトしました');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    } finally {
      setTimeout(() => setIsLoggingOut(false), 3000); // 1秒後にフラグをOFF
    }
  };

  // ホバー時に開く（遅延付き）
  const handleMouseEnter = () => {
    if (drawerTimeout.current) clearTimeout(drawerTimeout.current);
    drawerTimeout.current = setTimeout(() => {
      setDrawerOpen(true);
    }, 400); // ← ここで遅延時間を設定
  };

  // ホバーが外れたら閉じる
  const handleMouseLeave = () => {
    drawerTimeout.current = setTimeout(() => {
      setDrawerOpen(false);
    }, 300);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navigateToYoutubeVideos = () => {
    router.push('/youtube_videos');
  };

  const navigateToHome = () => {
    router.push('/');
  };


  const searchRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shouldClearQuery, setShouldClearQuery] = useState(false);

  const toggleSearch = () => {
    if (searchOpen) {
      setShouldClearQuery(true);
      setSearchOpen(false);
    } else {
      setSearchOpen(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setQuery('');
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);


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

          {isMobile ? (
            <>
              <IconButton
                onClick={toggleSearch}
                sx={{
                  color: '#818cf8',
                  transition: 'color 0.3s ease, transform 0.3s ease',
                  '&:hover': {
                    color: '#FFD700',
                    transform: 'scale(1.1) translateY(-2px)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
              <SearchDialog searchOpen={searchOpen} toggleSearch={toggleSearch} />
            </>
          ) : (
            <SearchBox
              query={query}
              setQuery={setQuery}
              searchOpen={searchOpen}
              toggleSearch={toggleSearch}
              isMobile={isMobile}
              shouldClearQuery={shouldClearQuery}
              setShouldClearQuery={setShouldClearQuery}
            />
          )}


          <Button
            onClick={navigateToYoutubeVideos}
            startIcon={<YouTubeIcon className="youtube-icon" />}
            sx={{
              color: '#818cf8',
              fontWeight: 'bold',
              mr: 2, // ← ここを追加！（または数値調整）
              transition: 'color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                color: '#FF0000',
                transform: 'scale(1.1) translateY(-2px)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            一覧
          </Button>


          {/* アカウントアイコン（PCはホバーで開く、スマホはクリック） */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'inline-block', position: 'relative' }}
          >
            <IconButton
              size="large"
              onClick={isMobile ? toggleDrawer : undefined}
              sx={{
                color: '#818cf8'
              }}
            >
              <AccountCircle />
            </IconButton>
            <UserDrawer
              drawerOpen={drawerOpen}
              toggleDrawer={toggleDrawer}
              currentUser={currentUser}
              handleLogout={handleLogout}
              isMobile={isMobile} // スマホ用レイアウトにする
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

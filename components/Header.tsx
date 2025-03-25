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
import { useMediaQuery } from '@mui/material';
import useSuggestions from '../hooks/header/useSuggestions';


const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { setFlashMessage } = useFlashMessage();
  const { resolvedTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerTimeout = useRef<NodeJS.Timeout | null>(null);

  const [query, setQuery] = useState('');
  const suggestions = useSuggestions(query);
  const handleSuggestionClick = (id: number) => {
    router.push(`/youtube_videos/${id}`);
    setQuery('');
  };


  // スマホ判定
  const isMobile = useMediaQuery('(max-width: 768px)');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      router.push(`/youtube_videos?query=${encodeURIComponent(query)}`);
      setQuery('');
      if (isMobile) toggleSearch();
    }
  };

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

  // ホバー時に開く（ログアウト状態でも開く）
  const handleMouseEnter = () => {
    if (drawerTimeout.current) clearTimeout(drawerTimeout.current);
    setDrawerOpen(true);
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
                <Typography variant="body1" sx={{ marginLeft: 0.5, color: '#c084fc' }}>
                  検索
                </Typography>
              </IconButton>
              <SearchDialog searchOpen={searchOpen} toggleSearch={toggleSearch} />
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    padding: '2px 10px',
                    border: '1px solid rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  <SearchIcon sx={{ color: 'rgba(0,0,0,0.6)' }} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="動画検索"
                    style={{
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      padding: '8px',
                      fontSize: '0.9rem',
                      width: '300px',
                    }}
                  />
                </div>
              </form>

              {/* ▼ サジェストリスト表示 */}
              {query.length > 0 && (
                <ul
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    marginTop: '4px',
                    width: '100%',
                    zIndex: 1000,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    color: 'black',
                    padding: '0.5rem 0',
                  }}
                >
                  {suggestions.length > 0 ? (
                    suggestions.slice(0, 5).map((suggestion) => (
                      <li
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion.id)}
                        style={{
                          padding: '10px',
                          cursor: 'pointer',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                      >
                        {suggestion.title}
                      </li>
                    ))
                  ) : (
                    <li
                      style={{
                        padding: '10px',
                        textAlign: 'left',
                        color: '#888',
                        pointerEvents: 'none',
                      }}
                    >
                      該当する動画はありません
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}


          <Button
            onClick={navigateToYoutubeVideos}
            startIcon={<YouTubeIcon className="youtube-icon" />}
            sx={{
              color: '#818cf8',
              fontWeight: 'bold',
              transition: 'color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                color: '#FF0000', // ホバー時にYouTubeカラーに変更
                transform: 'scale(1.1) translateY(-2px)', // 拡大＆浮かせる
              },
              '&:active': {
                transform: 'scale(0.95)', // クリック時に押し込む
              },
            }}
          >
            YouTube
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
                color: '#818cf8',
                '&:hover': { color: '#c084fc', transform: 'scale(1.1)', transition: 'transform 0.3s ease' },
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

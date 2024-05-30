import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SearchDialog from './Header/SearchDialog';
import UserDrawer from './Header/UserDrawer';
import FlashMessage from '../components/FlashMessage'; // フラッシュメッセージコンポーネントのインポート
import { useFlashMessage } from '../context/FlashMessageContext'; // フラッシュメッセージコンテキストのインポート
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { setFlashMessage } = useFlashMessage(); // フラッシュメッセージの使用
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const isMessageDisplayed = localStorage.getItem('isMessageDisplayed');
    if (isMessageDisplayed === 'true') {
      setFlashMessage('ロード中です。');
    }
  }, [setFlashMessage]);

  const handleLogout = async () => {
    if (window.confirm('本当にログアウトしますか？')) {
      await logout();
      setDrawerOpen(false); // ドロワーを閉じる
      localStorage.setItem('isMessageDisplayed', 'false');
      router.push('/?flash_message=ログアウトしました');
    }
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
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

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'black', zIndex: 1300 }}>
        <Toolbar disableGutters>
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
                }
              }}
            >
              ViMemo
            </Typography>
          </span>
          <div style={{ flexGrow: 1 }} /> {/* ダミーのスペースを追加 */}
          <div className="flex items-center">
            <IconButton onClick={toggleSearch} color="inherit">
              <SearchIcon />
              <Typography variant="body1" sx={{ marginLeft: 1 }}>
                検索
              </Typography>
            </IconButton>
            <SearchDialog
              searchOpen={searchOpen}
              toggleSearch={toggleSearch}
            />
          </div>
          <Button color="inherit" onClick={navigateToYoutubeVideos} startIcon={<YouTubeIcon />}>
            <Typography variant="body1">
              YouTube
            </Typography>
          </Button>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={toggleDrawer(true)}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <UserDrawer
              drawerOpen={drawerOpen}
              toggleDrawer={toggleDrawer}
              currentUser={currentUser}
              handleLogout={handleLogout}
            />
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ height: '64px' }} /> {/* ヘッダーの高さと一致するスペースを作成 */}
      <FlashMessage /> {/* フラッシュメッセージコンポーネントを追加 */}
    </>
  );
};

export default Header;

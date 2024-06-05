import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import NoteIcon from '@mui/icons-material/Note';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import { CustomUser } from '../../types/user';
import ThemeToggleButton from '../ThemeToggleButton';

interface UserDrawerProps {
  drawerOpen: boolean;
  toggleDrawer: (open: boolean) => () => void;
  currentUser: CustomUser | null;
  handleLogout: () => void;
}

const clearCacheAndCookies = () => {
  if (window.caches) {
    caches.keys().then((names) => {
      for (let name of names) caches.delete(name);
    });
  }
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
};

const UserDrawer: React.FC<UserDrawerProps> = ({ drawerOpen, toggleDrawer, currentUser, handleLogout }) => {
  const router = useRouter();

  const handleLogoutClick = async () => {
    // UIをすぐに更新してDrawerを閉じる
    toggleDrawer(false)();

    // キャッシュとCookieをクリア
    clearCacheAndCookies();

    // ログアウトリクエストを非同期に送信
    try {
      await handleLogout();
      // ログアウト処理が完了した後にリダイレクト
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '300px',
          position: 'fixed',
          right: 0,
          height: '100%',
          zIndex: 1400,
          marginTop: '75px',
        },
      }}
    >
      <IconButton
        edge="start"
        color="inherit"
        onClick={toggleDrawer(false)}
        aria-label="close"
        sx={{ position: 'absolute', top: 8, left: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <List sx={{ marginTop: '48px' }}>
        {currentUser ? (
          <>
            <ListItem>
              <Typography variant="subtitle1" sx={{ ml: 2 }}>
                こんにちは、{currentUser.name}さん
              </Typography>
            </ListItem>
            <ListItem
              button
              onClick={toggleDrawer(false)}
              component={Link}
              href="/"
              sx={{
                backgroundColor: router.pathname === '/' ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <Typography>ホーム</Typography>
            </ListItem>
            <ListItem
              button
              onClick={toggleDrawer(false)}
              component={Link}
              href="/mypage/dashboard"
              sx={{
                backgroundColor: router.pathname === '/mypage/dashboard' ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
              }}
            >
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <Typography>マイページ</Typography>
            </ListItem>
            <ListItem
              button
              onClick={toggleDrawer(false)}
              component={Link}
              href="/mypage/favorite_videos"
              sx={{
                backgroundColor: router.pathname === '/mypage/favorite_videos' ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
              }}
            >
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <Typography>いいねした動画</Typography>
            </ListItem>
            <ListItem
              button
              onClick={toggleDrawer(false)}
              component={Link}
              href="/mypage/favorite_notes"
              sx={{
                backgroundColor: router.pathname === '/mypage/favorite_notes' ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
              }}
            >
              <ListItemIcon>
                <NoteIcon />
              </ListItemIcon>
              <Typography>いいねしたメモ</Typography>
            </ListItem>
            <ListItem
              button
              onClick={toggleDrawer(false)}
              component={Link}
              href="/mypage/my_notes"
              sx={{
                backgroundColor: router.pathname === '/mypage/my_notes' ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
              }}
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              <Typography>MYメモ</Typography>
            </ListItem>
            <ListItem button onClick={handleLogoutClick}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <Typography>ログアウト</Typography>
            </ListItem>
            <ListItem>
              <ThemeToggleButton />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              button
              onClick={toggleDrawer(false)}
              component={Link}
              href="/"
              sx={{
                backgroundColor: router.pathname === '/' ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <Typography>ホーム</Typography>
            </ListItem>
            <ListItem
              button
              onClick={toggleDrawer(false)}
              component={Link}
              href="/login"
              sx={{
                backgroundColor: router.pathname === '/login' ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
              }}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <Typography>ログインページ</Typography>
            </ListItem>
            <ListItem>
              <ThemeToggleButton />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default UserDrawer;

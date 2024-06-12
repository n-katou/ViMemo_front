import React, { useState } from 'react';
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
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { CustomUser } from '../../types/user';
import ThemeToggleButton from '../ThemeToggleButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogoutDialogOpen = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = async () => {
    handleLogoutDialogClose();
    clearCacheAndCookies();
    try {
      await handleLogout();
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
          width: isMobile ? '70%' : '400px', // 携帯画面では幅を100%にする
          position: 'fixed',
          right: 0,
          height: '100%',
          zIndex: 1400,
          marginTop: isMobile ? '50px' : '75px', // 携帯画面ではマージンを0にする
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
      <List sx={{ marginTop: isMobile ? '30px' : '30px' }}>
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
            <ListItem button onClick={handleLogoutDialogOpen}>
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

      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutDialogClose}
      >
        <DialogTitle>ログアウト確認</DialogTitle>
        <DialogContent>
          <DialogContentText>本当にログアウトしますか？</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutDialogClose} color="primary">
            いいえ
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary" autoFocus>
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </Drawer>
  );
};

export default UserDrawer;

import React, { useState, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isVisible, setIsVisible] = useState(drawerOpen);

  useEffect(() => {
    if (drawerOpen) {
      setIsVisible(true);
    }
  }, [drawerOpen]);

  const handleDrawerClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      toggleDrawer(false)();
    }, 500); // アニメーションの持続時間と一致させる
  };

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

  const drawerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={drawerVariants}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100%',
            zIndex: 1400,
            width: isMobile ? '70%' : '400px',
            marginTop: isMobile ? '50px' : '75px',
            backgroundColor: theme.palette.background.default,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            color: 'black'
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleDrawerClose}
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
                {[
                  { text: 'ホーム', href: '/', icon: <HomeIcon /> },
                  { text: 'マイページ', href: '/mypage/dashboard', icon: <PersonIcon /> },
                  { text: 'いいねした動画', href: '/mypage/favorite_videos', icon: <FavoriteIcon /> },
                  { text: 'いいねしたメモ', href: '/mypage/favorite_notes', icon: <NoteIcon /> },
                  { text: 'MYメモ', href: '/mypage/my_notes', icon: <EditIcon /> },
                ].map((item) => (
                  <ListItem
                    button
                    key={item.text}
                    onClick={toggleDrawer(false)}
                    component={Link}
                    href={item.href}
                    sx={{ backgroundColor: router.pathname === item.href ? 'rgba(0, 0, 0, 0.1)' : 'inherit' }}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <Typography>{item.text}</Typography>
                  </ListItem>
                ))}
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
                {[
                  { text: 'ホーム', href: '/', icon: <HomeIcon /> },
                  { text: 'ログインページ', href: '/login', icon: <LoginIcon /> },
                ].map((item) => (
                  <ListItem
                    button
                    key={item.text}
                    onClick={toggleDrawer(false)}
                    component={Link}
                    href={item.href}
                    sx={{ backgroundColor: router.pathname === item.href ? 'rgba(0, 0, 0, 0.1)' : 'inherit' }}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <Typography>{item.text}</Typography>
                  </ListItem>
                ))}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserDrawer;

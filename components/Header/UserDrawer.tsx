import React, { useState } from 'react';
import { useRouter } from 'next/router';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { CustomUser } from '../../types/user';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import UserDrawerListItems from './UserDrawerListItems';

interface UserDrawerProps {
  drawerOpen: boolean;
  toggleDrawer: () => void;
  currentUser: CustomUser | null;
  handleLogout: () => void;
}

const UserDrawer: React.FC<UserDrawerProps> = ({ drawerOpen, toggleDrawer, currentUser, handleLogout }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleDrawerClose = () => {
    toggleDrawer();
  };

  const handleLogoutDialogOpen = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  const handleLogoutConfirm = async () => {
    handleLogoutDialogClose();
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
    <>
      <Backdrop open={drawerOpen} onClick={handleDrawerClose} sx={{ zIndex: 1300 }} />
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={drawerVariants}
            transition={{ duration: 0.5 }}
            className="bg-gradient-rainbow"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100%',
              zIndex: 1400,
              width: isMobile ? '70%' : isDesktop ? '40%' : '50%',
              color: 'white'
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleDrawerClose}
              aria-label="close"
              sx={{ position: 'absolute', top: 8, left: 8, color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
            <List sx={{ marginTop: isMobile ? '30px' : '30px' }}>
              <UserDrawerListItems
                currentUser={currentUser}
                handleDrawerClose={handleDrawerClose}
                handleLogoutDialogOpen={handleLogoutDialogOpen}
              />
            </List>

            <Dialog open={logoutDialogOpen} onClose={handleLogoutDialogClose}>
              <DialogTitle sx={{ color: 'black' }}>ログアウト確認</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ color: 'black' }}>本当にログアウトしますか？</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleLogoutDialogClose} color="primary">いいえ</Button>
                <Button onClick={handleLogoutConfirm} color="primary" autoFocus>はい</Button>
              </DialogActions>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UserDrawer;

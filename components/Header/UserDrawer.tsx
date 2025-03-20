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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  isMobile: boolean;
}

const UserDrawer: React.FC<UserDrawerProps> = ({ drawerOpen, toggleDrawer, currentUser, handleLogout, onMouseEnter, onMouseLeave }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleDrawerClose = () => {
    if (!isMobile) {
      // スマホではバツボタンでのみ閉じるため、Backdropクリックでは閉じない
      toggleDrawer();
    }
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
    hidden: { x: "100%", opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <>
      {/* 背景を暗くし、ぼかしを適用 */}
      <Backdrop
        open={drawerOpen}
        onClick={isMobile ? undefined : handleDrawerClose} // スマホではBackdropクリックでは閉じない
        sx={{ zIndex: 1300, background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(10px)" }}
      />

      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={drawerVariants}
            className="drawer-container"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              height: "100%",
              zIndex: 1400,
              width: isMobile ? "100vw" : isDesktop ? "40%" : "50%", // **スマホでは全画面表示**
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              borderLeft: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "-4px 0 10px rgba(0, 0, 0, 0.3)",
              color: "white",
              padding: "20px",
            }}
            onMouseEnter={isMobile ? undefined : onMouseEnter} // **スマホでは無効化**
            onMouseLeave={() => !isMobile && toggleDrawer()}
          >
            {/* 閉じるボタン */}
            <IconButton
              edge="start"
              onClick={toggleDrawer} // スマホではこれで閉じる
              aria-label="close"
              sx={{
                position: "absolute",
                top: 10,
                left: 10,
                color: "white",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* メニューリスト */}
            <List sx={{ marginTop: "40px" }}>
              <UserDrawerListItems currentUser={currentUser} handleDrawerClose={handleDrawerClose} handleLogoutDialogOpen={handleLogoutDialogOpen} />
            </List>

            {/* ログアウト確認ダイアログ */}
            <Dialog open={logoutDialogOpen} onClose={handleLogoutDialogClose}>
              <DialogTitle sx={{ color: "black" }}>ログアウト確認</DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ color: "black" }}>本当にログアウトしますか？</DialogContentText>
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

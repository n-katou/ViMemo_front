import React from 'react';
import Link from 'next/link';
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
import Typography from '@mui/material/Typography';
import { CustomUser } from '../../types/user';

interface UserDrawerProps {
  drawerOpen: boolean;
  toggleDrawer: (open: boolean) => () => void;
  currentUser: CustomUser | null;
  handleLogout: () => void;
}

const UserDrawer: React.FC<UserDrawerProps> = ({ drawerOpen, toggleDrawer, currentUser, handleLogout }) => {
  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: '250px',
          position: 'fixed',
          right: 0,
          height: '100%',
          zIndex: 1400, // zIndexをHeaderより高く設定
          marginTop: '64px', // Headerの高さ分マージンを追加
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
            <ListItem button onClick={toggleDrawer(false)} component={Link} href="/mypage/dashboard">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <Typography>マイページ</Typography>
            </ListItem>
            <ListItem button onClick={toggleDrawer(false)} component={Link} href="/mypage/favorites">
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <Typography>いいねした動画</Typography>
            </ListItem>
            <ListItem button onClick={toggleDrawer(false)} component={Link} href="/mypage/my_notes">
              <ListItemIcon>
                <NoteIcon />
              </ListItemIcon>
              <Typography>MYメモ一覧</Typography>
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <Typography>ログアウト</Typography>
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={toggleDrawer(false)} component={Link} href="/login">
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <Typography>ログインページ</Typography>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default UserDrawer;

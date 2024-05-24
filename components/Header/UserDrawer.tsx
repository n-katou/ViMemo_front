import React from 'react';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import NoteIcon from '@mui/icons-material/Note';
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
      sx={{ '& .MuiDrawer-paper': { width: '250px', position: 'fixed', right: 0, height: '100%' } }}
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
            <ListItem button onClick={toggleDrawer(false)} component={Link} href="/mypage/dashboard">
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="マイページ" />
            </ListItem>
            <ListItem button onClick={toggleDrawer(false)} component={Link} href="/mypage/favorites">
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="お気に入りの動画" />
            </ListItem>
            <ListItem button onClick={toggleDrawer(false)} component={Link} href="/mypage/my_notes">
              <ListItemIcon>
                <NoteIcon />
              </ListItemIcon>
              <ListItemText primary="MYメモ一覧" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="ログアウト" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={toggleDrawer(false)} component={Link} href="/login">
            <ListItemIcon>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="ログインページ" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default UserDrawer;

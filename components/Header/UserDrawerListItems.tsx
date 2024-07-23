import React from 'react';
import Link from 'next/link';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NoteIcon from '@mui/icons-material/Note';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import ThemeToggleButton from '../ThemeToggleButton';
import { CustomUser } from '../../types/user';
import { useRouter } from 'next/router';

interface UserDrawerListItemsProps {
  currentUser: CustomUser | null;
  handleDrawerClose: () => void;
  handleLogoutDialogOpen: () => void;
}

const UserDrawerListItems: React.FC<UserDrawerListItemsProps> = ({ currentUser, handleDrawerClose, handleLogoutDialogOpen }) => {
  const router = useRouter();

  return (
    <>
      {currentUser ? (
        <>
          <ListItem>
            <Typography variant="subtitle1" sx={{ ml: 2, color: 'white' }}>
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
              key={item.text}
              onClick={handleDrawerClose}
              component={Link}
              href={item.href}
              sx={{ backgroundColor: router.pathname === item.href ? 'rgba(0, 0, 0, 0.1)' : 'inherit' }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <Typography sx={{ color: 'white' }}>{item.text}</Typography>
            </ListItem>
          ))}
          <ListItem button onClick={handleLogoutDialogOpen}>
            <ListItemIcon sx={{ color: 'white' }}>
              <ExitToAppIcon />
            </ListItemIcon>
            <Typography sx={{ color: 'white' }}>ログアウト</Typography>
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
              key={item.text}
              onClick={handleDrawerClose}
              component={Link}
              href={item.href}
              sx={{ backgroundColor: router.pathname === item.href ? 'rgba(0, 0, 0, 0.1)' : 'inherit' }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <Typography sx={{ color: 'white' }}>{item.text}</Typography>
            </ListItem>
          ))}
          <ListItem>
            <ThemeToggleButton />
          </ListItem>
        </>
      )}
    </>
  );
};

export default UserDrawerListItems;

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { List, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { Home as HomeIcon, Person as PersonIcon, Favorite as FavoriteIcon, Note as NoteIcon, Edit as EditIcon, ExitToApp as ExitToAppIcon, Login as LoginIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ThemeToggleButton from '../ThemeToggleButton';
import { CustomUser } from '../../types/user';

interface UserDrawerListItemsProps {
  currentUser: CustomUser | null;
  handleDrawerClose: () => void;
  handleLogoutDialogOpen: () => void;
}

const UserDrawerListItems: React.FC<UserDrawerListItemsProps> = ({ currentUser, handleDrawerClose, handleLogoutDialogOpen }) => {
  const router = useRouter();

  const menuItems = currentUser
    ? [
      { text: 'ホーム', href: '/', icon: <HomeIcon /> },
      { text: 'マイページ', href: '/mypage/dashboard', icon: <PersonIcon /> },
      { text: 'いいねした動画', href: '/mypage/favorite_videos', icon: <FavoriteIcon /> },
      { text: 'いいねしたメモ', href: '/mypage/favorite_notes', icon: <NoteIcon /> },
      { text: 'MYメモ', href: '/mypage/my_notes', icon: <EditIcon /> },
    ]
    : [
      { text: 'ホーム', href: '/', icon: <HomeIcon /> },
      { text: 'ログインページ', href: '/login', icon: <LoginIcon /> },
    ];

  return (
    <>
      {currentUser && (
        <ListItemButton sx={{ textAlign: 'center', mb: 2, color: 'white', fontWeight: 'bold' }}>
          こんにちは、{currentUser.name}さん
        </ListItemButton>
      )}
      <List>
        {menuItems.map((item) => (
          <Link key={item.text} href={item.href} passHref legacyBehavior>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ListItemButton
                onClick={handleDrawerClose}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  color: 'white',
                  backgroundColor: router.pathname === item.href ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} sx={{ color: 'white' }} />
              </ListItemButton>
            </motion.div>
          </Link>
        ))}
        {currentUser && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <ListItemButton
              onClick={handleLogoutDialogOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: 2,
                px: 2,
                py: 1,
                color: 'white',
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="ログアウト" sx={{ color: 'white' }} />
            </ListItemButton>
          </motion.div>
        )}
      </List>
      <ListItemButton>
        <ThemeToggleButton />
      </ListItemButton>
    </>
  );
};

export default UserDrawerListItems;

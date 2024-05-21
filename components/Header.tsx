import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import NoteIcon from '@mui/icons-material/Note';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  border: '1px solid white',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: 0,
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
    paddingLeft: 0,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const Header = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('本当にログアウトしますか？')) {
      await logout();
      handleClose();
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query) {
      router.push(`/youtube_videos?query=${encodeURIComponent(query)}`);
      setQuery(''); // フォームをクリアする
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleSearch = () => {
    setSearchOpen((prevOpen) => !prevOpen);
  };

  const navigateToYoutubeVideos = () => {
    router.push('/youtube_videos');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            flexGrow: 1,
            fontSize: {
              xs: '1rem', // モバイル用のフォントサイズ
              sm: '1.25rem', // 小画面用のフォントサイズ
              md: '1.5rem', // 中画面以上のフォントサイズ
            }
          }}
        >
          Vimemo
        </Typography>
        {currentUser && (
          <div className="flex items-center">
            <IconButton onClick={toggleSearch} color="inherit">
              <SearchIcon />
            </IconButton>
            <Collapse in={searchOpen} timeout="auto" unmountOnExit>
              <form onSubmit={handleSearch} className="flex items-center ml-4">
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="タイトルで検索"
                    inputProps={{ 'aria-label': 'search' }}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{
                      fontSize: {
                        xs: '0.875rem', // モバイル用のフォントサイズ
                        sm: '1rem', // 小画面用のフォントサイズ
                        md: '1rem', // 中画面以上のフォントサイズ
                      }
                    }}
                  />
                </Search>
              </form>
            </Collapse>
          </div>
        )}
        {currentUser && (
          <Button color="inherit" onClick={navigateToYoutubeVideos} startIcon={<YouTubeIcon />}>
            YouTube
          </Button>
        )}
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {currentUser ? (
              [
                <StyledMenuItem onClick={handleClose} key="mypage">
                  <PersonIcon sx={{ marginRight: 1 }} />
                  <Link href="/mypage">マイページ</Link>
                </StyledMenuItem>,
                <StyledMenuItem onClick={handleClose} key="favorites">
                  <FavoriteIcon sx={{ marginRight: 1 }} />
                  <Link href="/favorites">お気に入りの動画</Link>
                </StyledMenuItem>,
                <StyledMenuItem onClick={handleClose} key="my_notes">
                  <NoteIcon sx={{ marginRight: 1 }} />
                  <Link href="/my_notes">MYメモ一覧</Link>
                </StyledMenuItem>,
                <StyledMenuItem onClick={handleLogout} key="logout">
                  <ExitToAppIcon sx={{ marginRight: 1 }} />
                  ログアウト
                </StyledMenuItem>
              ]
            ) : (
              <StyledMenuItem onClick={handleClose}>
                <LoginIcon sx={{ marginRight: 1 }} />
                <Link href="/login">ログインページ</Link>
              </StyledMenuItem>
            )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

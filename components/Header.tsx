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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
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
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm('本当にログアウトしますか？')) {
      logout();
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
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Vimemo
        </Typography>
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
                  placeholder="動画タイトルを検索"
                  inputProps={{ 'aria-label': 'search' }}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </Search>
            </form>
          </Collapse>
        </div>
        <Button color="inherit" onClick={navigateToYoutubeVideos}>
          Youtube
        </Button>
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
              <>
                <MenuItem onClick={handleClose}>
                  <Link href="/mypage">マイページ</Link>
                </MenuItem>
                <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleClose}>
                <Link href="/login">ログインページ</Link>
              </MenuItem>
            )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

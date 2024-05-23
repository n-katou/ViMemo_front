import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer'; // Drawerをインポート
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LoginIcon from '@mui/icons-material/Login';
import NoteIcon from '@mui/icons-material/Note';
import axios from 'axios';
import { useFlashMessage } from '../context/FlashMessageContext';

interface Video {
  id: number;
  title: string;
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  border: '1px solid grey', // ここで枠を追加
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

const SuggestionItem = styled('li')(({ theme }) => ({
  padding: theme.spacing(1),
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const { setFlashMessage } = useFlashMessage(); 
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Video[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false); // Drawerの開閉状態を管理するための状態を追加
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const isMessageDisplayed = localStorage.getItem('isMessageDisplayed');
    if (isMessageDisplayed === 'true') {
      setFlashMessage('ロード中です。');
    }
  }, [setFlashMessage]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/autocomplete`, {
            params: { query }
          });
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleLogout = async () => {
    if (window.confirm('本当にログアウトしますか？')) {
      await logout();
      setFlashMessage('ログアウトしました');
      localStorage.setItem('isMessageDisplayed', 'false');
      setDrawerOpen(false); // Drawerを閉じる
      router.push('/');
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query) {
      router.push(`/youtube_videos?query=${encodeURIComponent(query)}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const navigateToYoutubeVideos = () => {
    router.push('/youtube_videos');
  };

  const handleSuggestionClick = (id: number) => {
    router.push(`/youtube_videos/${id}`);
    setSearchOpen(false);
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
              xs: '1rem',
              sm: '1.25rem',
              md: '1.5rem',
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
            <Dialog open={searchOpen} onClose={toggleSearch}>
              <DialogTitle>検索</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSearch}>
                  <Search>
                    <SearchIconWrapper>
                      <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                      placeholder="タイトル検索"
                      inputProps={{ 'aria-label': 'search' }}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </Search>
                  <ul>
                    {suggestions.map((suggestion) => (
                      <SuggestionItem key={suggestion.id} onClick={() => handleSuggestionClick(suggestion.id)}>
                        {suggestion.title}
                      </SuggestionItem>
                    ))}
                  </ul>
                  <Button type="submit" variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
                    検索
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
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
            onClick={toggleDrawer(true)}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {currentUser ? (
              <div>
                <StyledMenuItem onClick={toggleDrawer(false)}>
                  <PersonIcon sx={{ marginRight: 1 }} />
                  <Link href="/mypage/dashboard">マイページ</Link>
                </StyledMenuItem>
                <StyledMenuItem onClick={toggleDrawer(false)}>
                  <FavoriteIcon sx={{ marginRight: 1 }} />
                  <Link href="/mypage/favorites">お気に入りの動画</Link>
                </StyledMenuItem>
                <StyledMenuItem onClick={toggleDrawer(false)}>
                  <NoteIcon sx={{ marginRight: 1 }} />
                  <Link href="/mypage/my_notes">MYメモ一覧</Link>
                </StyledMenuItem>
                <StyledMenuItem onClick={handleLogout}>
                  <ExitToAppIcon sx={{ marginRight: 1 }} />
                  ログアウト
                </StyledMenuItem>
              </div>
            ) : (
              <StyledMenuItem onClick={toggleDrawer(false)}>
                <LoginIcon sx={{ marginRight: 1 }} />
                <Link href="/login">ログインページ</Link>
              </StyledMenuItem>
            )}
          </Drawer>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

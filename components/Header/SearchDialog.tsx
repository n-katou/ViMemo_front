import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import GradientButton from '../../styles/GradientButton';
import { Search, SearchIconWrapper, StyledInputBase, StyledMenuItem } from '../../styles/header/SearchDialogStyles';
import useSuggestions from '../../hooks/header/useSuggestions';
import useMaxSuggestions from '../../hooks/header/useMaxSuggestions';
import { useMediaQuery, useTheme } from '@mui/material';

interface SearchDialogProps {
  searchOpen: boolean;
  toggleSearch: () => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ searchOpen, toggleSearch }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const suggestions = useSuggestions(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query) {
      router.push(`/youtube_videos?query=${encodeURIComponent(query)}`);
      setQuery('');
      toggleSearch();
    }
  };

  const handleSuggestionClick = (id: number) => {
    router.push(`/youtube_videos/${id}`);
    toggleSearch();
  };

  const handleSearchClick = () => {
    inputRef.current?.focus();
  };

  return (
    <Dialog
      open={searchOpen}
      onClose={toggleSearch}
      maxWidth="sm"
      fullScreen={isMobile} // モバイルではフルスクリーン
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0px 2px 10px rgba(255, 255, 255, 0.5)',
        }}
      >
        検索
        <IconButton
          edge="end"
          onClick={toggleSearch}
          aria-label="close"
          sx={{
            color: 'white',
            transition: '0.3s',
            '&:hover': { color: 'red' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSearch}
        >
          <Search
            onClick={handleSearchClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#f5f5f5', // よりナチュラルな白
              border: '1px solid rgba(0, 0, 0, 0.2)', // 枠線を薄く
              transition: '0.3s ease-in-out',
              '&:hover': {
                background: '#eeeeee', // ホバー時に淡いグレー
                borderColor: 'rgba(0, 0, 0, 0.3)', // ホバー時の枠線を強調
              },
              '&:focus-within': {
                border: '1px solid rgba(0, 0, 0, 0.5)', // フォーカス時に黒を強調
                background: '#fff', // 背景を純白に
              },
            }}
          >
            <SearchIconWrapper sx={{ background: 'transparent', padding: '0 12px' }}>
              <SearchIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="タイトル検索"
              inputProps={{ 'aria-label': 'search' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              inputRef={inputRef}
              sx={{
                flex: 1,
                fontSize: '1rem',
                padding: '12px',
                border: 'none',
                background: 'transparent',
                transition: '0.3s ease-in-out',
                '&:focus': { backgroundColor: 'transparent' },
              }}
            />
          </Search>
          {/* サジェストリスト */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              listStyleType: 'none',
              padding: 0,
              marginTop: 10,
              borderRadius: 8,
              overflowY: 'auto',
              maxHeight: 200,
              background: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              position: 'relative',
            }}
          >
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <StyledMenuItem
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.id)}
                  sx={{
                    color: 'white',
                    transition: '0.3s',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.4)' },
                  }}
                >
                  {suggestion.title}
                </StyledMenuItem>
              ))
            ) : (
              <li style={{ padding: '12px 16px', color: '#ccc' }}>該当する動画はありません。</li>
            )}
          </motion.ul>


          {/* 検索ボタン */}
          <GradientButton
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              textTransform: 'uppercase', // 大文字で強調
              fontWeight: 'bold',
              transition: '0.3s',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          >
            検索
          </GradientButton>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;

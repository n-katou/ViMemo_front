import React, { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import GradientButton from '../../styles/GradientButton';
import { Search, SearchIconWrapper, StyledInputBase, StyledMenuItem } from '../../styles/header/SearchDialogStyles';
import useSuggestions from '../../hooks/header/useSuggestions';
import useMaxSuggestions from '../../hooks/header/useMaxSuggestions';

interface SearchDialogProps {
  searchOpen: boolean;
  toggleSearch: () => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ searchOpen, toggleSearch }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const suggestions = useSuggestions(query);
  const maxSuggestions = useMaxSuggestions();
  const inputRef = useRef<HTMLInputElement>(null);

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
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        検索
        <IconButton
          edge="end"
          color="inherit"
          onClick={toggleSearch}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSearch}>
          <Search onClick={handleSearchClick}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="タイトル検索"
              inputProps={{ 'aria-label': 'search' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              inputRef={inputRef}
            />
          </Search>
          <ul>
            {suggestions.slice(0, maxSuggestions).map((suggestion) => (
              <StyledMenuItem key={suggestion.id} onClick={() => handleSuggestionClick(suggestion.id)}>
                {suggestion.title}
              </StyledMenuItem>
            ))}
          </ul>
          <GradientButton type="submit" variant="contained" fullWidth sx={{ marginTop: 2 }}>
            検索
          </GradientButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { AnimatePresence, motion } from 'framer-motion';
import useSuggestions from '../../hooks/header/useSuggestions';

interface SearchBoxProps {
  query: string;
  setQuery: (value: string) => void;
  searchOpen: boolean;
  toggleSearch: () => void;
  isMobile: boolean;
  shouldClearQuery: boolean;
  setShouldClearQuery: (val: boolean) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  query,
  setQuery,
  searchOpen,
  toggleSearch,
  isMobile,
  shouldClearQuery,
  setShouldClearQuery,
}) => {
  const router = useRouter();
  const suggestions = useSuggestions(query);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query) {
      router.push(`/youtube_videos?query=${encodeURIComponent(query)}`);
      setQuery('');
      if (isMobile) toggleSearch();
    }
  };

  const handleSuggestionClick = (id: number) => {
    router.push(`/youtube_videos/${id}`);
    setQuery('');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setQuery('');
        toggleSearch();
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen, toggleSearch, setQuery]);

  return (
    <div style={{ position: 'relative' }} ref={searchRef}>
      <IconButton
        onClick={toggleSearch}
        sx={{
          color: '#818cf8',
          transition: 'color 0.3s ease, transform 0.3s ease',
          '&:hover': {
            color: '#FFD700',
            transform: 'scale(1.1) translateY(-2px)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          marginRight: '8px',
        }}
      >
        <SearchIcon />
      </IconButton>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              overflow: 'hidden',
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
            onAnimationComplete={() => {
              if (!searchOpen && shouldClearQuery) {
                setQuery('');
                setShouldClearQuery(false);
              }
            }}
          >
            <form onSubmit={handleSearch}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  padding: '2px 10px',
                  border: '1px solid rgba(0,0,0,0.2)',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="動画検索"
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    padding: '8px',
                    fontSize: '0.9rem',
                    width: '100%',
                  }}
                />
                <IconButton
                  size="small"
                  onClick={toggleSearch}
                  sx={{
                    color: '#666',
                    ml: 1,
                    p: 0.5,
                    '&:hover': {
                      color: '#000',
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            </form>
          </motion.div>
        )}

        {query.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              marginTop: '4px',
              width: '100%',
              zIndex: 1000,
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
              maxHeight: '200px',
              overflowY: 'auto',
              color: 'black',
              padding: '0.5rem 0',
            }}
          >
            {suggestions.length > 0 ? (
              suggestions.slice(0, 5).map((suggestion) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion.id)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f0f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                >
                  {suggestion.title}
                </li>
              ))
            ) : (
              <li
                style={{
                  padding: '10px',
                  textAlign: 'left',
                  color: '#888',
                  pointerEvents: 'none',
                }}
              >
                該当する動画はありません
              </li>
            )}
          </ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBox;

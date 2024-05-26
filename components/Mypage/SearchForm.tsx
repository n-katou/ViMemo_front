import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/lab/Autocomplete';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  suggestions: string[];
  handleSearch: (event: React.FormEvent<HTMLFormElement>) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ searchQuery, setSearchQuery, suggestions, handleSearch }) => {
  return (
    <Card className="mb-8">
      <CardContent>
        <form onSubmit={handleSearch}>
          <Box display="flex" alignItems="center" width="100%">
            <Autocomplete
              freeSolo
              options={suggestions}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="キーワードで動画を取得"
                />
              )}
              sx={{ flex: 1 }}
            />
            <Button type="submit" variant="contained" className="btn btn-outline btn-pink" sx={{ ml: 2 }}>
              取得
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;

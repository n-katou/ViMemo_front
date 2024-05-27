import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import UserCard from '../../components/Mypage/UserCard';
import YoutubeLikesAccordion from '../../components/Mypage/YoutubeLikesAccordion';
import NoteLikesAccordion from '../../components/Mypage/NoteLikesAccordion';
import SearchForm from '../../components/Mypage/SearchForm';
import { fetchData, fetchVideosByGenre, debouncedFetchSuggestions, shufflePlaylist } from '../../src/dashboard';

const Dashboard = () => {
  const { currentUser, jwtToken, loading, setAuthState } = useAuth();
  const router = useRouter();
  const [youtubeVideoLikes, setYoutubeVideoLikes] = useState([]);
  const [noteLikes, setNoteLikes] = useState([]);
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [flashMessage, setFlashMessageState] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const fetchDataCallback = useCallback(() => {
    fetchData(jwtToken, currentUser, setAuthState, setYoutubeVideoLikes, setNoteLikes, setYoutubePlaylistUrl, setFlashMessageState, setShowSnackbar, router);
  }, [jwtToken, currentUser, setAuthState, router]);

  useEffect(() => {
    if (jwtToken && currentUser) {
      fetchDataCallback();
    }
  }, [jwtToken, currentUser, fetchDataCallback]);

  useEffect(() => {
    debouncedFetchSuggestions(searchQuery, setSuggestions);
  }, [searchQuery]);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    setFlashMessageState('');
  };

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Please log in to access the dashboard.</p></div>;
  }

  const isAdmin = currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-8 md:mb-0">
          <UserCard currentUser={currentUser} isAdmin={isAdmin} />
        </div>
        <div className="w-full md:flex-1 md:pl-8">
          {currentUser.role === 'admin' && (
            <SearchForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              suggestions={suggestions}
              handleSearch={(e) => {
                e.preventDefault();
                fetchVideosByGenre(searchQuery, jwtToken, setYoutubeVideos, router);
              }}
            />
          )}
          <YoutubeLikesAccordion
            youtubeVideoLikes={youtubeVideoLikes}
            youtubePlaylistUrl={youtubePlaylistUrl}
            shufflePlaylist={() => shufflePlaylist(jwtToken, setYoutubePlaylistUrl)}
          />
          <NoteLikesAccordion noteLikes={noteLikes} />
        </div>
      </div>
      {flashMessage && (
        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {flashMessage}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default Dashboard;

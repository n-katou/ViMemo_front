import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { useAuth } from '../../context/AuthContext';
import { useFlashMessage } from '../../context/FlashMessageContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import UserCard from '../../components/Mypage/UserCard';
import YoutubeLikesAccordion from '../../components/Mypage/YoutubeLikesAccordion';
import NoteLikesAccordion from '../../components/Mypage/NoteLikesAccordion';
import SearchForm from '../../components/Mypage/SearchForm';
import { CustomUser } from '../../types/user';
import { Like } from '../../types/like';

const Dashboard: React.FC = () => {
  const { currentUser, jwtToken, loading, setAuthState } = useAuth();
  const { setFlashMessage } = useFlashMessage();
  const router = useRouter();
  const [youtubeVideoLikes, setYoutubeVideoLikes] = useState<Like[]>([]);
  const [noteLikes, setNoteLikes] = useState<Like[]>([]);
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [flashMessage, setFlashMessageState] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      if (!jwtToken) {
        console.error('Token is undefined');
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mypage`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        const { youtube_video_likes, note_likes, youtube_playlist_url, avatar_url, role, email, name } = response.data;
        setYoutubeVideoLikes(youtube_video_likes);
        setNoteLikes(note_likes);
        setYoutubePlaylistUrl(youtube_playlist_url);

        if (currentUser) {
          const updatedUser: CustomUser = {
            ...currentUser,
            avatar_url,
            role,
            email,
            name,
          };

          setAuthState({
            currentUser: updatedUser,
            jwtToken,
          });
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }

        if (!localStorage.getItem('isMessageDisplayed')) {
          setFlashMessage('ログインに成功しました');
          localStorage.setItem('isMessageDisplayed', 'true');
        }
      } catch (error) {
        setFlashMessage('ログインに失敗しました');
        console.error('Error fetching mypage data:', error);
      }
    };

    const loginSuccessMessage = localStorage.getItem('loginSuccessMessage');
    if (loginSuccessMessage) {
      setFlashMessageState(loginSuccessMessage);
      localStorage.removeItem('loginSuccessMessage');
    }

    fetchData();
  }, [jwtToken]);

  const fetchVideosByGenre = async (genre: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/fetch_videos_by_genre`, {
        params: { genre },
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        const { youtube_videos_data, newly_created_count } = response.data;
        setYoutubeVideos(youtube_videos_data);
        setFlashMessage(`動画を ${newly_created_count} 件取得しました`);

        router.push(`/youtube_videos`);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching YouTube videos:', error.response?.data || error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(async (query: string) => {
    if (!query) return;

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
        },
      });

      if (response.status === 200) {
        const items = response.data.items;
        const titles = items.map((item: any) => item.snippet.title);
        setSuggestions(titles);
      }
    } catch (error) {
      console.error('Error fetching YouTube suggestions:', error);
    }
  }, 1000), []);

  useEffect(() => {
    debouncedFetchSuggestions(searchQuery);
  }, [searchQuery]);

  const shufflePlaylist = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/generate_shuffle_playlist`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        const { shuffled_youtube_playlist_url } = response.data;
        setYoutubePlaylistUrl(shuffled_youtube_playlist_url);
      }
    } catch (error) {
      console.error('Error generating shuffled playlist:', error);
    }
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
                fetchVideosByGenre(searchQuery);
              }}
            />
          )}
          <YoutubeLikesAccordion
            youtubeVideoLikes={youtubeVideoLikes}
            youtubePlaylistUrl={youtubePlaylistUrl}
            shufflePlaylist={shufflePlaylist}
          />
          <NoteLikesAccordion noteLikes={noteLikes} />
        </div>
      </div>
      {flashMessage && (
        <Snackbar
          open={!!flashMessage}
          autoHideDuration={6000}
          onClose={() => setFlashMessageState('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setFlashMessageState('')} severity="success" sx={{ width: '100%' }}>
            {flashMessage}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
};

export default Dashboard;

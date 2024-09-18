import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { fetchData, fetchVideosByGenre, shufflePlaylist } from '../../../components/Mypage/dashboard/dashboardUtils';
import { CustomUser } from '../../../types/user';

interface UseDashboardDataParams {
  jwtToken: string | null;
  currentUser: CustomUser | null;
  setAuthState: (state: any) => void;
}

interface UseDashboardDataReturn {
  youtubeVideoLikes: any[];
  setYoutubeVideoLikes: (likes: any[]) => void;
  noteLikes: any[];
  youtubePlaylistUrl: string;
  youtubeVideos: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  suggestions: any[];
  flashMessage: string;
  showSnackbar: boolean;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleCloseSnackbar: () => void;
  shufflePlaylist: () => void;
}

export const useDashboardData = ({
  jwtToken,
  currentUser,
  setAuthState,
}: UseDashboardDataParams): UseDashboardDataReturn => {
  const router = useRouter();
  const [youtubeVideoLikes, setYoutubeVideoLikes] = useState<any[]>([]);
  const [noteLikes, setNoteLikes] = useState<any[]>([]);
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [flashMessage, setFlashMessageState] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const fetchDataCallback = useCallback(() => {
    fetchData(
      jwtToken,
      currentUser,
      setAuthState,
      setYoutubeVideoLikes,
      setNoteLikes,
      setYoutubePlaylistUrl,
      setFlashMessageState,
      setShowSnackbar,
      router
    );
  }, [jwtToken, currentUser, setAuthState, router]);

  useEffect(() => {
    if (jwtToken && currentUser) {
      fetchDataCallback();
    }
  }, [jwtToken, currentUser, fetchDataCallback]);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for genre:', searchQuery);
    await fetchVideosByGenre(searchQuery, jwtToken, setYoutubeVideos, setFlashMessageState, setShowSnackbar, router);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    setFlashMessageState('');
  };

  return {
    youtubeVideoLikes,
    setYoutubeVideoLikes,
    noteLikes,
    youtubePlaylistUrl,
    youtubeVideos,
    searchQuery,
    setSearchQuery,
    suggestions,
    flashMessage,
    showSnackbar,
    handleSearch,
    handleCloseSnackbar,
    shufflePlaylist: () => shufflePlaylist(jwtToken, setYoutubePlaylistUrl, setYoutubeVideoLikes),
  };
};

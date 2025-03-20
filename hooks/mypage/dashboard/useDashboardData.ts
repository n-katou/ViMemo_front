import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { fetchData, fetchVideosByGenre, shufflePlaylist } from '../../../components/Mypage/dashboard/dashboardUtils';
import { CustomUser } from '../../../types/user';
import { Like } from '../../../types/like';

interface UseDashboardDataParams {
  jwtToken: string | null;
  currentUser: CustomUser | null;
  setAuthState: (state: any) => void;
}

interface UseDashboardDataReturn {
  youtubeVideoLikes: Like[];
  setYoutubeVideoLikes: (likes: Like[]) => void;
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
  shufflePlaylist: () => Promise<Like[]>; // 修正: `Promise<Like[]>` を返す
}

export const useDashboardData = ({
  jwtToken,
  currentUser,
  setAuthState,
}: UseDashboardDataParams): UseDashboardDataReturn => {
  const router = useRouter();
  const [youtubeVideoLikes, setYoutubeVideoLikes] = useState<Like[]>([]);
  const [noteLikes, setNoteLikes] = useState<any[]>([]);
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [flashMessage, setFlashMessageState] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const fetchDataCallback = useCallback(async () => {
    try {
      await fetchData(
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
    } catch (error) {
      setFlashMessageState('データの取得に失敗しました。');
      setShowSnackbar(true);
    }
  }, [
    jwtToken,
    currentUser,
    setAuthState,
    setYoutubeVideoLikes,
    setNoteLikes,
    setYoutubePlaylistUrl,
    setFlashMessageState,
    setShowSnackbar,
    router
  ]);

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

  // 修正: `shufflePlaylist` の戻り値を `Promise<Like[]>` に変更
  const handleShufflePlaylist = async (): Promise<Like[]> => {
    const shuffledVideos = await shufflePlaylist(jwtToken, setYoutubePlaylistUrl, setYoutubeVideoLikes);
    return shuffledVideos;
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
    shufflePlaylist: handleShufflePlaylist, // 修正: `Promise<Like[]>` を返す関数を設定
  };
};

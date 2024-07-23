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
import { fetchData, fetchVideosByGenre, shufflePlaylist } from '../../components/Mypage/dashboard';

const Dashboard = () => {
  // 認証コンテキストから必要な情報を取得
  const { currentUser, jwtToken, loading, setAuthState } = useAuth();
  const router = useRouter();

  // コンポーネントの状態を管理するためのuseStateフックを使用
  const [youtubeVideoLikes, setYoutubeVideoLikes] = useState([]);
  const [noteLikes, setNoteLikes] = useState([]);
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [flashMessage, setFlashMessageState] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);

  // データをフェッチするコールバック関数を定義
  const fetchDataCallback = useCallback(() => {
    fetchData(jwtToken, currentUser, setAuthState, setYoutubeVideoLikes, setNoteLikes, setYoutubePlaylistUrl, setFlashMessageState, setShowSnackbar, router);
  }, [jwtToken, currentUser, setAuthState, router]);

  // コンポーネントがマウントされた時とjwtTokenまたはcurrentUserが変更された時にデータをフェッチ
  useEffect(() => {
    if (jwtToken && currentUser) {
      fetchDataCallback();
    }
  }, [jwtToken, currentUser, fetchDataCallback]);

  // フラッシュメッセージをチェックして表示
  useEffect(() => {
    const flashMessage = localStorage.getItem('flashMessage');
    if (flashMessage) {
      setFlashMessageState(flashMessage);
      setShowSnackbar(true);
      localStorage.removeItem('flashMessage');
    }
  }, []);

  // Snackbarを閉じるハンドラー関数
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    setFlashMessageState('');
  };

  // ローディング中の場合にスピナーを表示
  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  // ユーザーがログインしていない場合にログインを促すメッセージを表示
  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">ログインして下さい。</p></div>;
  }

  // 管理者ユーザーかどうかを判定
  const isAdmin = currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return (
    <div className="container mx-auto px-4 py-8 mt-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 lg:w-1/4 mb-8 md:mb-0">
          <UserCard currentUser={currentUser} isAdmin={isAdmin} />
        </div>
        <div className="w-full md:flex-1 md:pl-8">
          <SearchForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            suggestions={suggestions}
            handleSearch={async (e) => {
              e.preventDefault();
              console.log('Searching for genre:', searchQuery);
              try {
                await fetchVideosByGenre(searchQuery, jwtToken, setYoutubeVideos, setFlashMessageState, setShowSnackbar, router);
              } catch (error) {
                console.error('Error fetching videos:', error);
                setFlashMessageState('ビデオを取得できませんでした。');
                setShowSnackbar(true);
              }
            }}
          />
        </div>
      </div>
      <div className="w-full mt-8">
        <YoutubeLikesAccordion
          youtubeVideoLikes={youtubeVideoLikes}
          youtubePlaylistUrl={youtubePlaylistUrl}
          shufflePlaylist={() => shufflePlaylist(jwtToken, setYoutubePlaylistUrl)}
        />
        {/* <div className="mt-8 space-y-6">
          <NoteLikesAccordion noteLikes={noteLikes} />
        </div> */}
      </div>
      {flashMessage && (
        <Snackbar
          open={showSnackbar}
          autoHideDuration={4000}
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

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
import { fetchData, fetchVideosByGenre, debouncedFetchSuggestions, shufflePlaylist } from '../../components/Mypage/dashboard';

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

  // 検索クエリが変更された時にサジェスチョンをフェッチ
  // useEffect(() => {
  //   debouncedFetchSuggestions(searchQuery, setSuggestions);
  // }, [searchQuery]);

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
  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-8 md:mb-0">
          {/* ユーザー情報カードを表示 */}
          <UserCard currentUser={currentUser} isAdmin={isAdmin} />
        </div>
        <div className="w-full md:flex-1 md:pl-8">
          {/* 検索フォームを表示 */}
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
          {/* YouTube動画のいいねアコーディオンを表示 */}
          <YoutubeLikesAccordion
            youtubeVideoLikes={youtubeVideoLikes}
            youtubePlaylistUrl={youtubePlaylistUrl}
            shufflePlaylist={() => shufflePlaylist(jwtToken, setYoutubePlaylistUrl)}
          />
          {/* ノートのいいねアコーディオンを表示 */}
          <NoteLikesAccordion noteLikes={noteLikes} />
        </div>
      </div>
      {/* フラッシュメッセージがある場合にSnackbarを表示 */}
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

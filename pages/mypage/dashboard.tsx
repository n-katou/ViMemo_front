import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import UserCard from '../../components/Mypage/UserCard'; // ユーザーカードコンポーネントをインポート
import YoutubeLikesAccordion from '../../components/Mypage/YoutubeLikesAccordion'; // ノートいいねアコーディオンコンポーネントをインポート
import NoteLikesAccordion from '../../components/Mypage/NoteLikesAccordion'; // ノートいいねアコーディオンコンポーネントをインポート
import SearchForm from '../../components/Mypage/SearchForm'; // 検索フォームコンポーネントをインポート
import { fetchData, fetchVideosByGenre, debouncedFetchSuggestions, shufflePlaylist } from '../../src/dashboard'; // データフェッチ用の関数をインポート

const Dashboard = () => {
  const { currentUser, jwtToken, loading, setAuthState } = useAuth(); // 認証コンテキストから必要な情報を取得
  const router = useRouter();
  const [youtubeVideoLikes, setYoutubeVideoLikes] = useState([]); // YouTube動画のいいねリストの状態を管理
  const [noteLikes, setNoteLikes] = useState([]); // ノートのいいねリストの状態を管理
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState(''); // YouTubeプレイリストのURLの状態を管理
  const [youtubeVideos, setYoutubeVideos] = useState([]); // YouTube動画のリストの状態を管理
  const [searchQuery, setSearchQuery] = useState(''); // 検索クエリの状態を管理
  const [suggestions, setSuggestions] = useState([]); // 検索サジェスチョンの状態を管理
  const [flashMessage, setFlashMessageState] = useState(''); // フラッシュメッセージの状態を管理
  const [showSnackbar, setShowSnackbar] = useState(false); // Snackbarの表示状態を管理

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
  useEffect(() => {
    debouncedFetchSuggestions(searchQuery, setSuggestions);
  }, [searchQuery]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-8 md:mb-0">
          {/* ユーザー情報カードを表示 */}
          <UserCard currentUser={currentUser} isAdmin={isAdmin} />
        </div>
        <div className="w-full md:flex-1 md:pl-8">
          {/* 管理者ユーザーの場合に検索フォームを表示 */}
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

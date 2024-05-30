import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../types/youtubeVideo';
import { Like } from '../types/like';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PaginationComponent from '../components/Pagination';
import { fetchYoutubeVideos, handleLikeVideo, handleUnlikeVideo } from '../components/YoutubeIndex/youtubeIndexUtils';
import YoutubeVideoCard from '../components/YoutubeIndex/YoutubeVideoCard';

const ITEMS_PER_PAGE = 9;

const YoutubeVideosPage: React.FC = () => {
  // 認証コンテキストから現在のユーザーとJWTトークンを取得
  const { currentUser, jwtToken } = useAuth();
  const router = useRouter();
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    next_page: number | null;
    prev_page: number | null;
  }>({
    current_page: 1,
    total_pages: 1,
    next_page: null,
    prev_page: null,
  });
  const [sortOption, setSortOption] = useState<string>('created_at_desc'); // ソートオプション
  const [flashMessage, setFlashMessage] = useState<string | null>(null); // フラッシュメッセージ
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false); // スナックバーの表示状態

  const query = router.query.query as string || ''; // クエリパラメータの取得

  // YouTube動画をフェッチする関数
  const fetchData = async () => {
    setLoading(true); // ローディング状態をtrueに設定
    const result = await fetchYoutubeVideos(query, pagination.current_page, ITEMS_PER_PAGE, sortOption);

    if (result) {
      const updatedVideos = result.videos.map((video: YoutubeVideo) => ({
        ...video,
        liked: video.likes?.some((like: Like) => like.user_id === Number(currentUser?.id)) || false, // 現在のユーザーがいいねしたかどうか
        likeId: video.likes?.find((like: Like) => like.user_id === Number(currentUser?.id))?.id || undefined, // 現在のユーザーのいいねID
      }));
      setYoutubeVideos(updatedVideos); // フェッチした動画を状態に設定
      setPagination(result.pagination); // ページネーション情報を状態に設定
      setError(null); // エラーメッセージをクリア
    } else {
      setError('YouTube動画を取得できませんでした'); // エラーメッセージを設定
    }
    setLoading(false); // ローディング状態をfalseに設定
  };

  // コンポーネントがマウントされたときと、ページやソートオプションが変わったときに動画をフェッチ
  useEffect(() => {
    fetchData();
  }, [pagination.current_page, query, sortOption]);

  // フラッシュメッセージを表示
  useEffect(() => {
    if (router.query.flashMessage) {
      setFlashMessage(router.query.flashMessage as string); // フラッシュメッセージを設定
      setShowSnackbar(true); // スナックバーを表示
      const { flashMessage, ...rest } = router.query;
      router.replace({
        pathname: router.pathname,
        query: rest,
      }, undefined, { shallow: true }); // クエリパラメータからフラッシュメッセージを削除
    }
  }, [router.query]);

  // タイトルクリック時に動画詳細ページに遷移する関数
  const handleTitleClick = async (id: number) => {
    const cleanUrl = `/youtube_videos/${id}`;
    await router.push(cleanUrl);
  };

  // ソートオプション変更時にソートオプションを設定し、ページをリセットする関数
  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
    setPagination({ ...pagination, current_page: 1 });
  };

  // いいねボタンのクリック時にいいねを処理する関数
  const handleLikeVideoWrapper = async (id: number) => {
    await handleLikeVideo(id, jwtToken!, currentUser, setYoutubeVideos);
  };

  // いいね解除ボタンのクリック時にいいね解除を処理する関数
  const handleUnlikeVideoWrapper = async (youtubeVideoId: number, likeId: number) => {
    await handleUnlikeVideo(youtubeVideoId, likeId, jwtToken!, currentUser, setYoutubeVideos);
  };

  // スナックバーを閉じる関数
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    setFlashMessage(null);
  };

  // ローディング中の場合の表示
  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  // エラーが発生した場合の表示
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold text-white-900">Youtube一覧</h1>
      {/* ソートオプションのセレクトボックス */}
      <div className="flex justify-end mb-4">
        <select
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
          className="form-select form-select-lg text-white bg-gray-800 border-gray-600"
        >
          <option value="created_at_desc">デフォルト（新しい順）</option>
          <option value="likes_desc">いいね数順</option>
          <option value="notes_desc">メモ数順</option>
        </select>
      </div>
      {/* 動画リストの表示 */}
      {youtubeVideos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {youtubeVideos.map((video: YoutubeVideo) => (
              <YoutubeVideoCard
                key={video.id}
                video={video}
                handleTitleClick={handleTitleClick}
                handleLikeVideo={handleLikeVideoWrapper}
                handleUnlikeVideo={handleUnlikeVideoWrapper}
              />
            ))}
          </div>
          {/* ページネーションコンポーネント */}
          <PaginationComponent
            count={pagination.total_pages}
            page={pagination.current_page}
            onChange={(event, value) => setPagination({ ...pagination, current_page: value })}
          />
        </>
      ) : <p>動画がありません。</p>}
      {/* スナックバーの表示 */}
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

export default YoutubeVideosPage;

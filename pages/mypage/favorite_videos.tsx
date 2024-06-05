import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { YoutubeVideo } from '../../types/youtubeVideo';
import PaginationComponent from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchVideoLikes } from '../../src/api';
import { fetchFavorites, fetchUserLikeStatus, favoriteVideoHandleLike, favoriteVideoHandleUnlike } from '../../components/Mypage/favorite_videos/favoriteVidoesUtils'; // API操作関数をインポート

import VideoCard from '../../components/Mypage/favorite_videos/FavoriteVideoCard'; // ビデオカードコンポーネントをインポート

const ITEMS_PER_PAGE = 9; // 一ページあたりのアイテム数を定義

const FavoriteVideosPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth(); // 現在のユーザーとJWTトークンを取得
  const router = useRouter();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]); // お気に入り動画の状態を管理
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1, // 現在のページ
    total_pages: 1, // 総ページ数
    next_page: null, // 次のページ
    prev_page: null, // 前のページ
  });
  const [sortOption, setSortOption] = useState<string>('created_at_desc'); // ソートオプションの状態を管理

  // クエリパラメータを更新する関数
  const updateQueryParams = (page: number, sort: string) => {
    router.push({
      pathname: router.pathname,
      query: { page, sort },
    }, undefined, { shallow: true });
  };

  // お気に入り動画をフェッチして状態にセットする関数
  const fetchAndSetFavorites = async (page: number, sort: string) => {
    setLoading(true); // ローディングを開始
    try {
      const result = await fetchFavorites(page, sort, jwtToken, currentUser, ITEMS_PER_PAGE); // APIからお気に入り動画を取得
      if (result) {
        setVideos(result.videos); // 取得した動画を状態にセット
        setPagination(result.pagination); // ページネーション情報を状態にセット
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // エラーメッセージを状態にセット
      } else {
        setError('不明なエラーが発生しました。'); // 不明なエラーの場合のメッセージ
      }
    } finally {
      setLoading(false); // ローディングを終了
    }
  };

  // コンポーネントがマウントされたときにお気に入り動画をフェッチする
  useEffect(() => {
    const page = parseInt(router.query.page as string, 10) || 1;
    const sort = router.query.sort as string || 'created_at_desc';
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
    setSortOption(sort);
    fetchAndSetFavorites(page, sort); // 現在のページとソートオプションに基づいて動画をフェッチ
  }, [router.query.page, router.query.sort]); // ページまたはソートオプションが変わるたびにフェッチ

  // いいねを処理する関数
  const handleLikeVideo = async (id: number) => {
    await favoriteVideoHandleLike(id, jwtToken, fetchVideoLikes, fetchUserLikeStatus, setVideos);
  };

  // いいね解除を処理する関数
  const handleUnlikeVideo = async (youtubeVideoId: number, likeId: number | undefined) => {
    await favoriteVideoHandleUnlike(youtubeVideoId, likeId, jwtToken, fetchVideoLikes, fetchUserLikeStatus, setVideos);
  };

  // ページ変更時に呼ばれる関数
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    updateQueryParams(page, sortOption);
  };

  // ソートオプション変更時に呼ばれる関数
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    updateQueryParams(1, newSortOption);
  };

  if (loading) return <LoadingSpinner loading={loading} />; // ローディング中はスピナーを表示
  if (error) return <p>Error: {error}</p>; // エラーが発生した場合はエラーメッセージを表示

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-white-900">いいねしたYoutube一覧</h1>
      <div className="flex justify-end mb-8">
        <select value={sortOption} onChange={handleSortChange} className="form-select text-white bg-gray-800 border-gray-600">
          <option value="created_at_desc">デフォルト（投稿順）</option>
          <option value="likes_desc">いいね数順</option>
          <option value="notes_desc">メモ数順</option>
        </select>
      </div>
      {videos && videos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video: YoutubeVideo) => (
              <VideoCard
                key={video.id}
                video={video}
                currentUser={currentUser}
                handleLikeVideo={handleLikeVideo}
                handleUnlikeVideo={handleUnlikeVideo}
                notes={video.notes} // `notes` プロパティを渡す
              />
            ))}
          </div>
          <PaginationComponent
            count={pagination.total_pages}
            page={pagination.current_page}
            onChange={handlePageChange}
          />
        </>
      ) : <p>お気に入りの動画はありません。</p>}
    </div>
  );
};

export default FavoriteVideosPage;

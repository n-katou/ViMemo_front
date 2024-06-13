import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { YoutubeVideo } from '../../types/youtubeVideo';
import PaginationComponent from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchVideoLikes } from '../../src/api';
import { fetchFavorites, fetchUserLikeStatus, favoriteVideoHandleLike, favoriteVideoHandleUnlike, saveVideoOrder } from '../../components/Mypage/favorite_videos/favoriteVidoesUtils'; // API操作関数をインポート
import VideoCard from '../../components/Mypage/favorite_videos/FavoriteVideoCard'; // ビデオカードコンポーネントをインポート
import { DndProvider, useDrag, useDrop } from 'react-dnd'; // react-dndをインポート
import update from 'immutability-helper'; // update関数をインポート
import { HTML5Backend } from 'react-dnd-html5-backend';

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
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // 一ページあたりのアイテム数を管理

  // クエリパラメータを更新する関数
  const updateQueryParams = (page: number, sort: string, perPage: number) => {
    router.push({
      pathname: router.pathname,
      query: { page, sort, perPage },
    }, undefined, { shallow: true });
  };

  // お気に入り動画をフェッチして状態にセットする関数
  const fetchAndSetFavorites = async (page: number, sort: string, perPage: number) => {
    setLoading(true); // ローディングを開始
    try {
      const result = await fetchFavorites(page, sort, jwtToken, currentUser, perPage); // APIからお気に入り動画を取得
      if (result) {
        setVideos(result.videos.sort((a: YoutubeVideo, b: YoutubeVideo) => a.sort_order! - b.sort_order!)); // 取得した動画をsort_orderに基づいてソートして状態にセット
        setPagination(result.pagination); // ページネーション情報を状態にセット
        console.log('Fetched videos:', result.videos); // 追加: フェッチした動画をログ出力
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
    const perPage = parseInt(router.query.perPage as string, 10) || itemsPerPage;
    setPagination((prev) => ({
      ...prev,
      current_page: page,
    }));
    setSortOption(sort);
    setItemsPerPage(perPage);
    fetchAndSetFavorites(page, sort, perPage); // 現在のページとソートオプションに基づいて動画をフェッチ
  }, [router.query.page, router.query.sort, router.query.perPage]); // ページまたはソートオプションが変わるたびにフェッチ

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
    updateQueryParams(page, sortOption, itemsPerPage);
  };

  // ソートオプション変更時に呼ばれる関数
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    updateQueryParams(1, newSortOption, itemsPerPage);
  };

  // 表示件数変更時に呼ばれる関数
  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    updateQueryParams(1, sortOption, newItemsPerPage);
  };

  // 動画の並び替えを処理する関数
  const moveVideo = (dragIndex: number, hoverIndex: number) => {
    const draggedVideo = videos[dragIndex];
    const newVideos = update(videos, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, draggedVideo],
      ],
    });
    setVideos(newVideos);
    console.log('Video order before saving:', newVideos); // 追加: 新しい順序をログ出力
    saveVideoOrder(newVideos, jwtToken).then(() => {
      // 並び替えが保存された後に動画リストを再フェッチする
    });
  };

  if (loading) return <LoadingSpinner loading={loading} />; // ローディング中はスピナーを表示
  if (error) return <p>Error: {error}</p>; // エラーが発生した場合はエラーメッセージを表示

  return (
    <DndProvider backend={HTML5Backend}> {/* DndProviderでラップ */}
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white-900">いいねしたYoutube一覧</h1>
        <div className="flex justify-end mb-8">
          <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="form-select text-white bg-gray-800 border-gray-600 ml-4">
            <option value={10}>10件表示</option>
            <option value={15}>15件表示</option>
            <option value={20}>20件表示</option>
            <option value={-1}>全件表示</option>
          </select>
        </div>
        {videos && videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {videos.map((video, index) => (
                <VideoCard
                  key={video.id}
                  index={index}
                  video={video}
                  currentUser={currentUser}
                  handleLikeVideo={handleLikeVideo}
                  handleUnlikeVideo={handleUnlikeVideo}
                  notes={video.notes} // `notes` プロパティを渡す
                  moveVideo={moveVideo} // moveVideo関数を渡す
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
    </DndProvider> // DndProviderを閉じる
  );
};

export default FavoriteVideosPage;

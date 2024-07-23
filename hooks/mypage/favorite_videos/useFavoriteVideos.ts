import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../../context/AuthContext';
import { YoutubeVideo } from '../../../types/youtubeVideo';
import { fetchFavorites, fetchUserLikeStatus, favoriteVideoHandleLike, favoriteVideoHandleUnlike, saveVideoOrder } from '../../../components/Mypage/favorite_videos/favoriteVidoesUtils';
import { fetchVideoLikes } from '../../../src/api';
import update from 'immutability-helper';

export const useFavoriteVideos = () => {
  const { currentUser, jwtToken } = useAuth();
  const router = useRouter();
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    next_page: null,
    prev_page: null,
  });
  const [sortOption, setSortOption] = useState<string>('created_at_desc');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const updateQueryParams = (page: number, sort: string, perPage: number) => {
    router.push({
      pathname: router.pathname,
      query: { page, sort, perPage },
    }, undefined, { shallow: true });
  };

  const fetchAndSetFavorites = useCallback(async (page: number, sort: string, perPage: number) => {
    setLoading(true);
    try {
      const result = await fetchFavorites(page, sort, jwtToken, currentUser, perPage);
      if (result) {
        setVideos(result.videos.sort((a: YoutubeVideo, b: YoutubeVideo) => a.sort_order! - b.sort_order!));
        setPagination(result.pagination);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('不明なエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  }, [jwtToken, currentUser]);

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
    fetchAndSetFavorites(page, sort, perPage);
  }, [router.query.page, router.query.sort, router.query.perPage, fetchAndSetFavorites]);

  const handleLikeVideo = async (id: number) => {
    await favoriteVideoHandleLike(id, jwtToken, fetchVideoLikes, fetchUserLikeStatus, setVideos);
  };

  const handleUnlikeVideo = async (youtubeVideoId: number, likeId: number | undefined) => {
    await favoriteVideoHandleUnlike(youtubeVideoId, likeId, jwtToken, fetchVideoLikes, fetchUserLikeStatus, setVideos);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    updateQueryParams(page, sortOption, itemsPerPage);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = event.target.value;
    setSortOption(newSortOption);
    updateQueryParams(1, newSortOption, itemsPerPage);
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    updateQueryParams(1, sortOption, newItemsPerPage);
  };

  const moveVideo = (dragIndex: number, hoverIndex: number) => {
    const draggedVideo = videos[dragIndex];
    const newVideos = update(videos, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, draggedVideo],
      ],
    });
    setVideos(newVideos);
    saveVideoOrder(newVideos, jwtToken).then(() => {
      // 並び替えが保存された後に動画リストを再フェッチする
    });
  };

  return {
    currentUser,
    videos,
    loading,
    error,
    pagination,
    sortOption,
    itemsPerPage,
    handleLikeVideo,
    handleUnlikeVideo,
    handlePageChange,
    handleSortChange,
    handleItemsPerPageChange,
    moveVideo,
  };
};

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../../../types/youtubeVideo';
import { Note } from '../../../types/note';
import { useAuth } from '../../../context/AuthContext';
import { fetchYoutubeVideos, handleLikeVideo, handleUnlikeVideo } from '../../../components/YoutubeIndex/youtubeIndexUtils';

const ITEMS_PER_PAGE = 20;

const useYoutubeVideosPage = () => {
  const { currentUser, jwtToken } = useAuth();
  const router = useRouter();
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
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
  const [sortOption, setSortOption] = useState<string>('created_at_desc');
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const query = router.query.query as string || '';

  const fetchData = async (page: number, sort: string) => {
    setLoading(true);
    const result = await fetchYoutubeVideos(query, page, ITEMS_PER_PAGE, sort);

    if (result) {
      const updatedVideos = result.videos.map((video: YoutubeVideo) => ({
        ...video,
        liked: video.likes?.some((like: any) => like.user_id === Number(currentUser?.id)) || false,
        likeId: video.likes?.find((like: any) => like.user_id === Number(currentUser?.id))?.id || undefined,
      }));
      setYoutubeVideos(updatedVideos);
      setNotes(result.notes || []); // メモを状態に設定、undefinedの場合は空配列を設定
      setPagination(result.pagination);
      setError(null);
    } else {
      setError('YouTube動画を取得できませんでした');
    }
    setLoading(false);
  };

  useEffect(() => {
    const currentPage = parseInt(router.query.page as string, 10) || 1;
    const currentSortOption = router.query.sort as string || 'created_at_desc';

    setPagination(prev => ({ ...prev, current_page: currentPage }));
    setSortOption(currentSortOption);
    fetchData(currentPage, currentSortOption);
  }, [router.query.page, router.query.sort, query]);

  useEffect(() => {
    if (router.query.flashMessage) {
      setFlashMessage(router.query.flashMessage as string);
      setShowSnackbar(true);
      const { flashMessage, ...rest } = router.query;
      router.replace({
        pathname: router.pathname,
        query: rest,
      }, undefined, { shallow: true });
    }
  }, [router.query]);

  const handleSortChange = (newSortOption: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sort: newSortOption, page: 1 },
    });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: value },
    });
  };

  const handleTitleClick = async (id: number) => {
    const cleanUrl = `/youtube_videos/${id}`;
    await router.push(cleanUrl);
  };

  const handleLikeVideoWrapper = async (id: number) => {
    await handleLikeVideo(id, jwtToken!, currentUser, setYoutubeVideos);
  };

  const handleUnlikeVideoWrapper = async (youtubeVideoId: number, likeId: number) => {
    await handleUnlikeVideo(youtubeVideoId, likeId, jwtToken!, currentUser, setYoutubeVideos);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    setFlashMessage(null);
  };

  return {
    youtubeVideos,
    notes,
    loading,
    error,
    pagination,
    sortOption,
    flashMessage,
    showSnackbar,
    jwtToken,
    setNotes,
    handleSortChange,
    handlePageChange,
    handleTitleClick,
    handleLikeVideoWrapper,
    handleUnlikeVideoWrapper,
    handleCloseSnackbar,
  };
};

export default useYoutubeVideosPage;

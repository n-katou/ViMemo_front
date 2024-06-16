import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../types/youtubeVideo';
import { Note } from '../types/note';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PaginationComponent from '../components/Pagination';
import { fetchYoutubeVideos, handleLikeVideo, handleUnlikeVideo } from '../components/YoutubeIndex/youtubeIndexUtils';
import YoutubeVideoCard from '../components/YoutubeIndex/YoutubeVideoCard';
import { useTheme } from 'next-themes';

const ITEMS_PER_PAGE = 9;

const YoutubeVideosPage: React.FC = () => {
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
  const { theme } = useTheme();

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

  const handleTitleClick = async (id: number) => {
    const cleanUrl = `/youtube_videos/${id}`;
    await router.push(cleanUrl);
  };

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

  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className={`container mx-auto py-8 px-4 ${theme === 'light' ? 'text-[#818cf8]' : 'text-white'}`}>
      <h1 className="text-3xl font-bold">Youtube一覧</h1>
      <div className="flex justify-end mb-8">
        <select
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
          className={`form-select form-select-lg ${theme === 'light' ? 'text-[#818cf8] bg-white border border-gray-600' : 'text-white bg-gray-800'}`}
        >
          <option value="created_at_desc">デフォルト（取得順）</option>
          <option value="published_at_desc">公開日順</option>
          <option value="likes_desc">いいね数順</option>
          <option value="notes_desc">メモ数順</option>
        </select>
      </div>
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
                notes={notes.filter(note => note.youtube_video_id === video.id)} // 動画に関連するメモを渡す
                setNotes={setNotes}
                jwtToken={jwtToken}
              />
            ))}
          </div>
          <PaginationComponent
            count={pagination.total_pages}
            page={pagination.current_page}
            onChange={handlePageChange}
          />
        </>
      ) : <p>動画がありません。</p>}
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

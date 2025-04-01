import { useEffect, useState } from 'react';
import { YoutubeVideo } from '@/types/youtubeVideo';
import { useAuth } from '../../../context/AuthContext';

const useYoutubeVideoRankings = () => {
  const [topLikedVideos, setTopLikedVideos] = useState<YoutubeVideo[]>([]);
  const [topNotedVideos, setTopNotedVideos] = useState<YoutubeVideo[]>([]);
  const [topRecentVideos, setTopRecentVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchRanking = async (sort: string, limit = 20): Promise<YoutubeVideo[] | null> => {
    try {
      const authToken = localStorage.getItem('authToken');

      const headers: Record<string, string> = {
        Accept: 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos?per_page=${limit}&sort=${sort}`,
        {
          method: 'GET',
          headers,
          credentials: 'include',
        }
      );

      if (!res.ok) {
        console.error(`Fetch error (${sort}):`, res.status, res.statusText);
        return null;
      }

      const data = await res.json();
      if (data && Array.isArray(data.videos)) {
        // liked / likeId を付加する処理
        const updatedVideos = data.videos.map((video: YoutubeVideo) => ({
          ...video,
          liked: video.likes?.some((like: any) => like.user_id === Number(currentUser?.id)) || false,
          likeId: video.likes?.find((like: any) => like.user_id === Number(currentUser?.id))?.id || undefined,
          notes: video.notes || [] // ← ここを明示的に追加
        }));
        return updatedVideos;
      } else {
        console.error(`Invalid data format for sort=${sort}`);
        return null;
      }
    } catch (error) {
      console.error(`Fetch exception (${sort}):`, error);
      return null;
    }
  };

  const fetchAllRankings = async () => {
    setLoading(true);
    const [liked, noted, recent] = await Promise.all([
      fetchRanking('likes_desc'),
      fetchRanking('notes_desc'),
      fetchRanking('published_at_desc'),
    ]);

    if (liked) setTopLikedVideos(liked);
    if (noted) setTopNotedVideos(noted);
    if (recent) setTopRecentVideos(recent);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllRankings();
  }, [currentUser?.id]); // currentUser が切り替わったときも反映

  return {
    topLikedVideos,
    topNotedVideos,
    topRecentVideos,
    loading,
    setTopLikedVideos,
    setTopNotedVideos,
    setTopRecentVideos,
    refetchAllRankings: fetchAllRankings,
  };
};

export default useYoutubeVideoRankings;

import { useEffect, useState } from 'react';
import { YoutubeVideo } from '@/types/youtubeVideo';
import { Note } from '@/types/note';

const useYoutubeVideoRankings = () => {
  const [topLikedVideos, setTopLikedVideos] = useState<YoutubeVideo[]>([]);
  const [topNotedVideos, setTopNotedVideos] = useState<YoutubeVideo[]>([]);
  const [topRecentVideos, setTopRecentVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRanking = async (sort: string, limit = 10): Promise<YoutubeVideo[] | null> => {
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
        return data.videos as YoutubeVideo[];
      } else {
        console.error(`Invalid data format for sort=${sort}`);
        return null;
      }
    } catch (error) {
      console.error(`Fetch exception (${sort}):`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
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

    fetchAll();
  }, []);

  return {
    topLikedVideos,
    topNotedVideos,
    topRecentVideos,
    loading,
  };
};

export default useYoutubeVideoRankings;

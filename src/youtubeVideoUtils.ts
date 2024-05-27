import { YoutubeVideo } from '../types/youtubeVideo';
import { Like } from '../types/like';
import { handleLike, handleUnlike, fetchVideoLikes } from './api';
import { formatDuration } from './videoUtils';

export const fetchYoutubeVideos = async (query = '', page = 1, itemsPerPage = 9, sort = '') => {
  try {
    const authToken = localStorage.getItem('authToken');
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos?q[title_cont]=${query}&page=${page}&per_page=${itemsPerPage}&sort=${sort}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    if (!res.ok) {
      console.error('Fetch error:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    if (data && Array.isArray(data.videos)) {
      return { videos: data.videos, pagination: data.pagination };
    } else {
      console.error('Invalid data format');
      return null;
    }
  } catch (error) {
    console.error('Fetch exception:', error);
    return null;
  }
};

export const handleLikeVideo = async (id: number, jwtToken: string, currentUser: any, setYoutubeVideos: React.Dispatch<React.SetStateAction<YoutubeVideo[]>>) => {
  setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
    prevVideos.map((video: YoutubeVideo) =>
      video.id === id ? { ...video, likes_count: video.likes_count + 1, liked: true } : video
    )
  );

  try {
    const result = await handleLike(id, jwtToken);
    if (result.success) {
      const likeData = await fetchVideoLikes(id);
      if (likeData) {
        setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
          prevVideos.map((video: YoutubeVideo) =>
            video.id === id ? { ...video, likes_count: likeData.likes_count, likes: likeData.likes, liked: true } : video
          )
        );
      }
    }
  } catch (error) {
    console.error('Like exception:', error);
  }
};

export const handleUnlikeVideo = async (youtubeVideoId: number, likeId: number, jwtToken: string, currentUser: any, setYoutubeVideos: React.Dispatch<React.SetStateAction<YoutubeVideo[]>>) => {
  setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
    prevVideos.map((video: YoutubeVideo) =>
      video.id === youtubeVideoId ? { ...video, likes_count: video.likes_count - 1, liked: false } : video
    )
  );

  try {
    const result = await handleUnlike(youtubeVideoId, likeId, jwtToken);
    if (result.success) {
      const likeData = await fetchVideoLikes(youtubeVideoId);
      if (likeData) {
        setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
          prevVideos.map((video: YoutubeVideo) =>
            video.id === youtubeVideoId ? { ...video, likes_count: likeData.likes_count, likes: likeData.likes, liked: false } : video
          )
        );
      }
    }
  } catch (error) {
    console.error('Unlike exception:', error);
  }
};

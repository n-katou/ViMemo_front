// playlistUtils.ts

import axios from 'axios';
import { YoutubeVideo } from '@/types/youtubeVideo';

export const fetchPublicPlaylists = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/public_playlists`);
    if (!res.ok) throw new Error("レスポンスエラー");
    return await res.json();
  } catch (error) {
    console.error("fetchPublicPlaylists エラー:", error);
    return [];
  }
};

export const fetchUserLikeStatus = async (videoId: number, jwtToken: string) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites_count`, {
      params: {
        likeable_type: 'YoutubeVideo',
        likeable_id: videoId,
      },
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return res.data.length > 0 ? res.data[0] : null;
  } catch (err) {
    console.error('Error fetching like status:', err);
    return null;
  }
};

export const favoriteVideoHandleLike = async (
  id: number,
  jwtToken: string,
  fetchVideoLikes: Function,
  fetchUserLikeStatus: Function,
  updateVideoState: (fn: (video: YoutubeVideo) => YoutubeVideo) => void
) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${id}/likes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        likeable_type: 'YoutubeVideo',
        likeable_id: id,
      }),
    });

    if (!res.ok) {
      console.error('Like error:', res.status, res.statusText);
      return;
    }

    const data = await res.json();
    if (!data.success) {
      console.error('Like error:', data.message);
      return;
    }

    const likeData = await fetchVideoLikes(id, jwtToken);
    const userLikeStatus = await fetchUserLikeStatus(id, jwtToken);

    if (likeData && userLikeStatus) {
      updateVideoState((video) => ({
        ...video,
        likes_count: likeData.likes_count,
        likes: likeData.likes,
        liked: true,
        likeId: userLikeStatus.id,
      }));
    }
  } catch (error) {
    console.error('Like exception:', error);
  }
};

// 動画のいいねを解除する関数
export const favoriteVideoHandleUnlike = async (
  youtubeVideoId: number,
  likeId: number | undefined,
  jwtToken: string | null,
  fetchVideoLikes: Function,
  fetchUserLikeStatus: Function,
  updateVideoState: (fn: (video: YoutubeVideo) => YoutubeVideo) => void
) => {
  if (!likeId) {
    console.error('Unlike error: likeId is undefined');
    return;
  }

  if (!jwtToken) {
    console.error('Unlike error: jwtToken is null');
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${youtubeVideoId}/likes/${likeId}?likeable_type=YoutubeVideo&likeable_id=${youtubeVideoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
      },
    });

    if (!res.ok) {
      console.error('Unlike error:', res.status, res.statusText);
      return;
    }

    const data = await res.json();
    if (!data.success) {
      console.error('Unlike error:', data.message);
      return;
    }

    const likeData = await fetchVideoLikes(youtubeVideoId, jwtToken);
    const userLikeStatus = await fetchUserLikeStatus(youtubeVideoId, jwtToken);

    if (likeData) {
      updateVideoState((video) => ({
        ...video,
        likes_count: likeData.likes_count,
        likes: likeData.likes,
        liked: !!userLikeStatus,
        likeId: userLikeStatus?.id,
      }));
    }
  } catch (error) {
    console.error('Unlike exception:', error);
  }
};

import axios from 'axios';

export const fetchFavorites = async (page, sort, jwtToken, currentUser, ITEMS_PER_PAGE) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites`, {
      params: { page, per_page: ITEMS_PER_PAGE, sort },
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (res.data) {
      return {
        videos: res.data.videos.map((video) => ({
          ...video,
          liked: video.likes.some((like) => like.user_id === Number(currentUser?.id)),
          likeId: video.likes.find((like) => like.user_id === Number(currentUser?.id))?.id || undefined,
        })),
        pagination: res.data.pagination,
      };
    }
  } catch (err) {
    console.error('Error fetching favorites:', err);
    throw new Error('お気に入りの動画を取得できませんでした。');
  }
};

export const fetchVideoLikes = async (videoId, jwtToken) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/likes`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error('Error fetching video likes:', err);
    return null;
  }
};

export const fetchUserLikeStatus = async (videoId, jwtToken) => {
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

export const handleLike = async (id, jwtToken, fetchVideoLikes, fetchUserLikeStatus, setVideos) => {
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
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === id ? {
            ...video,
            likes_count: likeData.likes_count,
            likes: likeData.likes,
            liked: true,
            likeId: userLikeStatus.id,
          } : video
        )
      );
    }
  } catch (error) {
    console.error('Like exception:', error);
  }
};

export const handleUnlike = async (youtubeVideoId, likeId, jwtToken, fetchVideoLikes, fetchUserLikeStatus, setVideos) => {
  if (!likeId) {
    console.error('Unlike error: likeId is undefined');
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${youtubeVideoId}/likes/${likeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        likeable_type: 'YoutubeVideo',
        likeable_id: youtubeVideoId,
      }),
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
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === youtubeVideoId ? {
            ...video,
            likes_count: likeData.likes_count,
            likes: likeData.likes,
            liked: userLikeStatus !== null,
            likeId: userLikeStatus ? userLikeStatus.id : undefined,
          } : video
        )
      );
    }
  } catch (error) {
    console.error('Unlike exception:', error);
  }
};

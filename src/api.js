import axios from 'axios';

export async function fetchYoutubeVideo(id, jwtToken) {
  const headers = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${jwtToken}`,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${id}`, {
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(`Error fetching video with ID ${id}`);
  }

  const data = await res.json();
  return data;
}

export async function handleLike(videoId, jwtToken) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/likes`,
      { likeable_type: 'YoutubeVideo', likeable_id: videoId },
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('handleLike response:', res);  // 追加: レスポンスをログ出力
    return res.data;
  } catch (error) {
    console.error('Failed to like the video:', error);
    return { success: false, error: 'Unable to like the video.' };
  }
}

export async function handleUnlike(videoId, likeId, jwtToken) {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/likes/${likeId}`,
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('handleUnlike response:', res);  // 追加: レスポンスをログ出力
    return res.data;
  } catch (error) {
    console.error('Failed to unlike the video:', error);
    return { success: false, error: 'Unable to unlike the video.' };
  }
}

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
    console.log('handleLike response:', res);
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

export async function addNoteToVideo(videoId, newNoteContent, timestampMinutes, timestampSeconds, isVisible, jwtToken) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes`,
      { content: newNoteContent, video_timestamp_minutes: timestampMinutes, video_timestamp_seconds: timestampSeconds, is_visible: isVisible },
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('addNoteToVideo response:', res);
    return res.data;
  } catch (error) {
    console.error('Failed to add note to video:', error);
    return { success: false, error: 'Unable to add note to video.' };
  }
}

export async function deleteNoteFromVideo(videoId, noteId, jwtToken) {
  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes/${noteId}`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
    console.log('deleteNoteFromVideo response:', res);
    return res.data;
  } catch (error) {
    console.error('Failed to delete note from video:', error);
    return { success: false, error: 'Unable to delete note from video.' };
  }
}

export async function editNoteInVideo(videoId, noteId, newContent, newMinutes, newSeconds, newIsVisible, jwtToken) {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes/${noteId}`,
      { content: newContent, video_timestamp_minutes: newMinutes, video_timestamp_seconds: newSeconds, is_visible: newIsVisible },
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        }
      }
    );
    console.log('editNoteInVideo response:', res);
    return res.data;
  } catch (error) {
    console.error('Failed to edit note in video:', error);
    return { success: false, error: 'Unable to edit note in video.' };
  }
}

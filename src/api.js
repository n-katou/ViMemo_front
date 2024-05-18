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
        },
        data: { likeable_type: 'YoutubeVideo', likeable_id: videoId }  // パラメータとして `likeable_type` と `likeable_id` を追加
      }
    );
    console.log('handleUnlike response:', res);  // 追加: レスポンスをログ出力
    return res.data;
  } catch (error) {
    console.error('Failed to unlike the video:', error);
    return { success: false, error: 'Unable to unlike the video.' };
  }
}

export async function addNoteToVideo(videoId, content, minutes, seconds, isVisible, jwtToken) {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes`,
      {
        content,
        video_timestamp_minutes: minutes,
        video_timestamp_seconds: seconds,
        is_visible: isVisible,
      },
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error('Failed to add note:', error);
    throw error;
  }
}

export async function deleteNoteFromVideo(videoId, noteId, jwtToken) {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes/${noteId}`,
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error('Failed to delete note:', error);
    throw error;
  }
}

export async function editNoteInVideo(videoId, noteId, content, minutes, seconds, isVisible, jwtToken) {
  try {
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes/${noteId}`,
      {
        content,
        video_timestamp_minutes: minutes,
        video_timestamp_seconds: seconds,
        is_visible: isVisible,
      },
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        }
      }
    );
    return res.data;
  } catch (error) {
    console.error('Failed to edit note:', error);
    throw error;
  }
}

export async function handleNoteLike(videoId, noteId, jwtToken) {
  try {
    console.log('JWT Token in handleNoteLike:', jwtToken);  // JWTトークンをログ出力
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes/${noteId}/likes`,
      { likeable_type: 'Note', likeable_id: noteId },
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('handleNoteLike response:', res);  // レスポンスをログ出力
    return res.data;
  } catch (error) {
    console.error('Failed to like the note:', error);
    return { success: false, error: 'Unable to like the note.' };
  }
}

export async function handleNoteUnlike(videoId, noteId, likeId, jwtToken) {
  try {
    console.log('JWT Token in handleNoteUnlike:', jwtToken);  // JWTトークンをログ出力
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes/${noteId}/likes/${likeId}`,
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
        data: { likeable_type: 'Note', likeable_id: noteId }
      }
    );
    console.log('handleNoteUnlike response:', res);  // レスポンスをログ出力
    return res.data;
  } catch (error) {
    console.error('Failed to unlike the note:', error);
    return { success: false, error: 'Unable to unlike the note.' };
  }
}

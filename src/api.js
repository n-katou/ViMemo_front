import axios from 'axios';

// YouTube動画関連の関数
// YouTube動画を取得する非同期関数
export async function fetchYoutubeVideo(videoId, jwtToken) {
  const headers = {
    'Accept': 'application/json',
  };

  // JWTトークンが存在する場合、ヘッダーに追加
  if (jwtToken) {
    headers['Authorization'] = `Bearer ${jwtToken}`;
  }

  // 動画データを取得するためのAPIリクエスト
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}`, {
    headers: headers,
  });

  // レスポンスが正常でない場合、エラーメッセージをスロー
  if (!res.ok) {
    throw new Error(`Error fetching video with ID ${videoId}`);
  }

  // レスポンスデータをJSON形式で返す
  const data = await res.json();
  return data;
}

// いいね関連の関数
// 動画にいいねを追加する非同期関数
export async function handleLike(videoId, jwtToken) {
  try {
    // いいねを追加するためのAPIリクエスト
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
    // エラーメッセージをコンソールに表示
    console.error('Failed to like the video:', error);
    return { success: false, error: 'Unable to like the video.' };
  }
}

// 動画のいいねを取り消す非同期関数
export async function handleUnlike(videoId, likeId, jwtToken) {
  try {
    // いいねを取り消すためのAPIリクエスト
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
    // エラーメッセージをコンソールに表示
    console.error('Failed to unlike the video:', error);
    return { success: false, error: 'Unable to unlike the video.' };
  }
}

// 動画のいいねリストを取得する非同期関数
export async function fetchVideoLikes(videoId, jwtToken) {
  try {
    const headers = {
      'Accept': 'application/json',
    };

    if (jwtToken) {
      headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/likes`, {
      headers: headers,
    });

    if (!res.ok) {
      throw new Error(`Error fetching likes for video with ID ${videoId}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch video likes:', error);
    return null;
  }
}


// ノート関連の関数
// 動画にノートを追加する非同期関数
export async function addNoteToVideo(videoId, content, minutes, seconds, isVisible, jwtToken) {
  try {
    // ノートを追加するためのAPIリクエスト
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
    // エラーメッセージをコンソールに表示
    console.error('Failed to add note:', error);
    throw error;
  }
}

// 動画からノートを削除する非同期関数
export async function deleteNoteFromVideo(videoId, noteId, jwtToken) {
  try {
    // ノートを削除するためのAPIリクエスト
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
    // エラーメッセージをコンソールに表示
    console.error('Failed to delete note:', error);
    throw error;
  }
}

// 動画内のノートを編集する非同期関数
export async function editNoteInVideo(videoId, noteId, content, minutes, seconds, isVisible, jwtToken) {
  try {
    // ノートを編集するためのAPIリクエスト
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
    // エラーメッセージをコンソールに表示
    console.error('Failed to edit note:', error);
    throw error;
  }
}

// ノートにいいねを追加する非同期関数
export async function handleNoteLike(videoId, noteId, jwtToken) {
  try {
    console.log('JWT Token in handleNoteLike:', jwtToken);  // JWTトークンをログ出力
    // ノートにいいねを追加するためのAPIリクエスト
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
    // エラーメッセージをコンソールに表示
    console.error('Failed to like the note:', error);
    return { success: false, error: 'Unable to like the note.' };
  }
}

// ノートのいいねを取り消す非同期関数
export async function handleNoteUnlike(videoId, noteId, likeId, jwtToken) {
  try {
    // ノートのいいねを取り消すためのAPIリクエスト
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes/${noteId}/likes/${likeId}`,
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
        data: { likeable_type: 'Note', likeable_id: noteId }  // パラメータとして `likeable_type` と `likeable_id` を追加
      }
    );
    console.log('handleNoteUnlike response:', res);  // レスポンスをログ出力
    return res.data;
  } catch (error) {
    // エラーメッセージをコンソールに表示
    console.error('Failed to unlike the note:', error);
    return { success: false, error: 'Unable to unlike the note.' };
  }
}

// 現在のユーザーがいいねしたノートを取得する非同期関数
export async function fetchCurrentUserLike(videoId, noteId, jwtToken) {
  try {
    // 現在のユーザーがいいねしたノートを取得するためのAPIリクエスト
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes/${noteId}/likes/current_user_like`,
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          likeable_type: 'Note',
          likeable_id: noteId // 追加
        }
      }
    );
    console.log('fetchCurrentUserLike response:', res); // レスポンスをログ出力
    return res.data.like_id;
  } catch (error) {
    // エラーメッセージをコンソールに表示
    console.error('Failed to fetch like for current user:', error);
    throw error;
  }
}

// 認証ヘッダーを処理する非同期関数
export default async function handler(req, res) {
  const jwtToken = req.headers.authorization?.split(' ')[1];

  // JWTトークンが存在しない場合、401エラーを返す
  if (!jwtToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // マイページデータを取得するためのAPIリクエスト
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/mypage`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    // マイページデータをレスポンスとして返す
    res.status(200).json(response.data);
  } catch (error) {
    // エラーメッセージをコンソールに表示
    console.error('Error fetching mypage data:', error);
    res.status(500).json({ message: 'Error fetching mypage data' });
  }
}

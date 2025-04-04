import axios from 'axios'; // axiosをインポートしてHTTPリクエストを処理

// プレイリスト内の動画一覧を取得
export const fetchPlaylistItems = async (playlistId, jwtToken) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/playlists/${playlistId}/playlist_items`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return res.data.items;
  } catch (error) {
    console.error('Error fetching playlist items:', error);
    throw new Error('プレイリスト動画の取得に失敗しました。');
  }
};

// プレイリスト作成
export const createPlaylist = async (name, jwtToken) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/playlists`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return res.data; // ← ここだけ修正！
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw new Error('プレイリストの作成に失敗しました。');
  }
};

// プレイリストに動画を追加
export const addVideoToPlaylist = async (
  playlistId,
  youtubeVideoId,
  jwtToken
) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/playlists/${playlistId}/playlist_items`,
      { youtube_video_id: youtubeVideoId },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error('動画の追加に失敗:', {
      playlistId,
      youtubeVideoId,
      error,
    });
    throw error;
  }
};

// 並び順更新（positionの配列を送る）
export const updatePlaylistOrder = async (
  playlistId,
  sortedVideoIds,
  jwtToken
) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/playlists/${playlistId}/items/sort`,
      { ordered_video_ids: sortedVideoIds },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('プレイリストの並び替えに失敗しました。');
  }
};

// プレイリスト削除
export const deletePlaylist = async (playlistId, jwtToken) => {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/playlists/${playlistId}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    throw new Error('プレイリストの削除に失敗しました。');
  }
};

// プレイリスト一覧を取得
export const fetchPlaylists = async (jwtToken) => {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/playlists`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    return res.data.playlists ?? []; // ← null/undefined 対策でデフォルト値を設定
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return []; // ← エラー時も空配列を返す
  }
};

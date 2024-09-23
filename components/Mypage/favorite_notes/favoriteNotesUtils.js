import axios from 'axios';

// ノートのいいねを取得するための非同期関数
export const fetchNoteLikes = async (
  jwtToken,
  setNoteLikes,
  setError,
  setLoading
) => {
  setLoading(true);
  setError(null); // エラー状態をリセット

  try {
    // APIリクエストを実行
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/like_note`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.data.note_likes) {
      throw new Error('Failed to fetch note likes');
    }

    setNoteLikes(response.data.note_likes); // 取得したデータを状態に設定
  } catch (error) {
    setError('メモのいいねの取得に失敗しました。'); // エラーメッセージを状態に設定
  } finally {
    setLoading(false); // ローディング状態を終了
  }
};

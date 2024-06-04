import axios from 'axios'; // axiosをインポートしてHTTPリクエストを処理

// お気に入り動画をフェッチする関数
export const fetchFavorites = async (page, sort, jwtToken, currentUser, ITEMS_PER_PAGE) => {
  try {
    // APIエンドポイントにGETリクエストを送信してお気に入り動画を取得
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites`, {
      params: { page, per_page: ITEMS_PER_PAGE, sort }, // クエリパラメータとしてページ番号、アイテム数、ソートオプションを指定
      headers: {
        Authorization: `Bearer ${jwtToken}`, // ヘッダーにJWTトークンを含める
      },
    });

    if (res.data) {
      // レスポンスデータが存在する場合、動画リストとページネーション情報を返す
      return {
        videos: res.data.videos.map((video) => ({
          ...video,
          liked: video.likes.some((like) => like.user_id === Number(currentUser?.id)), // 現在のユーザーがいいねしているかを確認
          likeId: video.likes.find((like) => like.user_id === Number(currentUser?.id))?.id || undefined, // いいねIDを取得
        })),
        pagination: res.data.pagination, // ページネーション情報をセット
      };
    }
  } catch (err) {
    // エラーハンドリング
    console.error('Error fetching favorites:', err);
    throw new Error('お気に入りの動画を取得できませんでした。'); // エラーメッセージを投げる
  }
};

// 特定の動画のいいね情報をフェッチする関数
export const fetchVideoLikes = async (videoId, jwtToken) => {
  try {
    // APIエンドポイントにGETリクエストを送信して特定の動画のいいね情報を取得
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/likes`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`, // ヘッダーにJWTトークンを含める
      },
    });
    return res.data; // レスポンスデータを返す
  } catch (err) {
    // エラーハンドリング
    console.error('Error fetching video likes:', err);
    return null; // エラーの場合はnullを返す
  }
};

// 特定のyoutubeに対するcurrent_userのいいねステータスをフェッチする関数
export const fetchUserLikeStatus = async (videoId, jwtToken) => {
  try {
    // APIエンドポイントにGETリクエストを送信して特定の動画に対するユーザーのいいねステータスを取得
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/favorites_count`, {
      params: {
        likeable_type: 'YoutubeVideo', // Likeのタイプを指定
        likeable_id: videoId, // 動画IDを指定
      },
      headers: {
        Authorization: `Bearer ${jwtToken}`, // ヘッダーにJWTトークンを含める
      },
    });
    return res.data.length > 0 ? res.data[0] : null; // いいねが存在する場合はそのデータを返し、存在しない場合はnullを返す
  } catch (err) {
    // エラーハンドリング
    console.error('Error fetching like status:', err);
    return null; // エラーの場合はnullを返す
  }
};

// 動画にいいねを付ける関数
export const handleLike = async (id, jwtToken, fetchVideoLikes, fetchUserLikeStatus, setVideos) => {
  try {
    // APIエンドポイントにPOSTリクエストを送信して動画にいいねを追加
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${id}/likes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`, // ヘッダーにJWTトークンを含める
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        likeable_type: 'YoutubeVideo', // Likeのタイプを指定
        likeable_id: id, // 動画IDを指定
      }),
    });

    if (!res.ok) {
      // レスポンスがOKでない場合のエラーハンドリング
      console.error('Like error:', res.status, res.statusText);
      return;
    }

    const data = await res.json();
    if (!data.success) {
      // 成功ステータスがfalseの場合のエラーハンドリング
      console.error('Like error:', data.message);
      return;
    }

    // いいね追加後の最新のいいね情報とユーザーのいいねステータスをフェッチ
    const likeData = await fetchVideoLikes(id, jwtToken);
    const userLikeStatus = await fetchUserLikeStatus(id, jwtToken);
    if (likeData && userLikeStatus) {
      // 動画のいいね情報を更新
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === id ? {
            ...video,
            likes_count: likeData.likes_count, // いいね数を更新
            likes: likeData.likes, // いいねリストを更新
            liked: true, // いいねステータスを更新
            likeId: userLikeStatus.id, // いいねIDを更新
          } : video
        )
      );
    }
  } catch (error) {
    // エラーハンドリング
    console.error('Like exception:', error);
  }
};

// 動画のいいねを解除する関数
export const handleUnlike = async (youtubeVideoId, likeId, jwtToken, fetchVideoLikes, fetchUserLikeStatus, setVideos) => {
  if (!likeId) {
    // いいねIDが未定義の場合のエラーハンドリング
    console.error('Unlike error: likeId is undefined');
    return;
  }

  try {
    // APIエンドポイントにDELETEリクエストを送信して動画のいいねを解除
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${youtubeVideoId}/likes/${likeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`, // ヘッダーにJWTトークンを含める
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        likeable_type: 'YoutubeVideo', // Likeのタイプを指定
        likeable_id: youtubeVideoId, // 動画IDを指定
      }),
    });

    if (!res.ok) {
      // レスポンスがOKでない場合のエラーハンドリング
      console.error('Unlike error:', res.status, res.statusText);
      return;
    }

    const data = await res.json();
    if (!data.success) {
      // 成功ステータスがfalseの場合のエラーハンドリング
      console.error('Unlike error:', data.message);
      return;
    }

    // いいね解除後の最新のいいね情報とユーザーのいいねステータスをフェッチ
    const likeData = await fetchVideoLikes(youtubeVideoId, jwtToken);
    const userLikeStatus = await fetchUserLikeStatus(youtubeVideoId, jwtToken);
    if (likeData) {
      // 動画のいいね情報を更新
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === youtubeVideoId ? {
            ...video,
            likes_count: likeData.likes_count, // いいね数を更新
            likes: likeData.likes, // いいねリストを更新
            liked: userLikeStatus !== null, // いいねステータスを更新
            likeId: userLikeStatus ? userLikeStatus.id : undefined, // いいねIDを更新
          } : video
        )
      );
    }
  } catch (error) {
    // エラーハンドリング
    console.error('Unlike exception:', error);
  }
};

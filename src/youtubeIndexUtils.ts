import { YoutubeVideo } from '../types/youtubeVideo';
import { handleLike, handleUnlike, fetchVideoLikes } from './api';

// YouTube動画を取得する関数
export const fetchYoutubeVideos = async (query = '', page = 1, itemsPerPage = 9, sort = '') => {
  try {
    // ローカルストレージから認証トークンを取得
    const authToken = localStorage.getItem('authToken');

    // リクエストヘッダーを設定
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // 認証トークンが存在する場合、Authorizationヘッダーを追加
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // YouTube動画APIにリクエストを送信
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos?q[title_cont]=${query}&page=${page}&per_page=${itemsPerPage}&sort=${sort}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    // レスポンスが正常でない場合、エラーログを出力してnullを返す
    if (!res.ok) {
      console.error('Fetch error:', res.status, res.statusText);
      return null;
    }

    // レスポンスをJSON形式で取得
    const data = await res.json();

    // 取得したデータが動画リスト形式である場合、動画データとページネーション情報を返す
    if (data && Array.isArray(data.videos)) {
      return { videos: data.videos, pagination: data.pagination };
    } else {
      // データ形式が無効な場合、エラーログを出力してnullを返す
      console.error('Invalid data format');
      return null;
    }
  } catch (error) {
    // リクエスト例外が発生した場合、エラーログを出力してnullを返す
    console.error('Fetch exception:', error);
    return null;
  }
};

// 動画にいいねを付ける関数
export const handleLikeVideo = async (id: number, jwtToken: string, currentUser: any, setYoutubeVideos: React.Dispatch<React.SetStateAction<YoutubeVideo[]>>) => {
  // いいねを付けるため、動画リストの状態を更新
  setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
    prevVideos.map((video: YoutubeVideo) =>
      video.id === id ? { ...video, likes_count: video.likes_count + 1, liked: true } : video
    )
  );

  try {
    // いいねAPIにリクエストを送信
    const result = await handleLike(id, jwtToken);
    if (result.success) {
      // いいねデータを取得
      const likeData = await fetchVideoLikes(id);
      if (likeData) {
        // いいねデータを基に動画リストの状態を更新
        setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
          prevVideos.map((video: YoutubeVideo) =>
            video.id === id ? { ...video, likes_count: likeData.likes_count, likes: likeData.likes, liked: true } : video
          )
        );
      }
    }
  } catch (error) {
    // 例外発生時のエラーログ
    console.error('Like exception:', error);
  }
};

// 動画のいいねを解除する関数
export const handleUnlikeVideo = async (youtubeVideoId: number, likeId: number, jwtToken: string, currentUser: any, setYoutubeVideos: React.Dispatch<React.SetStateAction<YoutubeVideo[]>>) => {
  // いいねを解除するため、動画リストの状態を更新
  setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
    prevVideos.map((video: YoutubeVideo) =>
      video.id === youtubeVideoId ? { ...video, likes_count: video.likes_count - 1, liked: false } : video
    )
  );

  try {
    // いいね解除APIにリクエストを送信
    const result = await handleUnlike(youtubeVideoId, likeId, jwtToken);
    if (result.success) {
      // いいねデータを取得
      const likeData = await fetchVideoLikes(youtubeVideoId);
      if (likeData) {
        // いいねデータを基に動画リストの状態を更新
        setYoutubeVideos((prevVideos: YoutubeVideo[]) =>
          prevVideos.map((video: YoutubeVideo) =>
            video.id === youtubeVideoId ? { ...video, likes_count: likeData.likes_count, likes: likeData.likes, liked: false } : video
          )
        );
      }
    }
  } catch (error) {
    // 例外発生時のエラーログ
    console.error('Unlike exception:', error);
  }
};

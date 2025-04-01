import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';
import { handleLike, handleUnlike, fetchVideoLikes } from '../../src/api';

// YouTube動画を取得する関数
export const fetchYoutubeVideos = async (query = '', page = 1, itemsPerPage = 9, sort = '') => {
  try {
    const authToken = localStorage.getItem('authToken');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos?q[title_cont]=${query}&page=${page}&per_page=${itemsPerPage}&sort=${sort}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
    });

    if (!res.ok) {
      console.error('Fetch error:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();

    if (data && Array.isArray(data.videos)) {
      console.log('Fetched videos:', data.videos);  // デバッグ用
      console.log('Fetched notes:', data.videos.flatMap((video: YoutubeVideo) => video.notes));  // デバッグ用
      return {
        videos: data.videos as YoutubeVideo[], // 動画データの型を明示的に指定
        notes: data.videos.flatMap((video: YoutubeVideo) => video.notes) as Note[], // メモデータの型を明示的に指定
        pagination: data.pagination
      };
    } else {
      console.error('Invalid data format');
      return null;
    }
  } catch (error) {
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

export const fetchRandomYoutubeVideo = async (): Promise<YoutubeVideo | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos?page=1&per_page=1000`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
      },
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Failed to fetch');

    const data = await res.json();
    const videos = data.videos as YoutubeVideo[];

    if (videos.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * videos.length);
    return videos[randomIndex];
  } catch (error) {
    console.error('fetchRandomYoutubeVideo error:', error);
    return null;
  }
};


import { CustomUser } from './user';
import { Like } from './like';

export interface YoutubeVideo {
  id: number;
  title: string;
}

export interface Note {
  id: number;
  content: string;
  video_timestamp: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  user: CustomUser;  // ユーザー情報を含める
  youtube_video_id: number;
  youtube_video: YoutubeVideo;
  likes_count: number; // いいねのカウントを追加
  likes: Like[];
}

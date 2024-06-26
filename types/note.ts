import { CustomUser } from './user';
import { Like } from './like';
import { YoutubeVideo } from './youtubeVideo';

export interface Note {
  id: number;
  content: string;
  video_timestamp: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  user: CustomUser;  // ユーザー情報を含める
  youtube_video: YoutubeVideo;
  youtube_video_id: number;
  youtube_video_title: string;
  likes_count: number; // いいねのカウントを追加
  likes: Like[];
  liked_by_current_user: boolean;
  current_user_like_id?: number;
  sort_order: number;
}

export interface NoteWithVideoTitle extends Note {
  video_title: string;
}

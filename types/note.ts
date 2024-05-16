import { CustomUser } from './user';

export interface Note {
  id: number;
  content: string;
  video_timestamp: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
  user: CustomUser;  // ユーザー情報を含める
  youtube_video_id: number;
  likes_count: number; // いいねのカウントを追加
}
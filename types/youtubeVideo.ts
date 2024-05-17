import { Like } from './like';

export interface YoutubeVideo {
  id: number;
  title: string;
  published_at: string;
  youtube_id: string;
  duration: string;
  likes_count: number;
  likes: Like[];
}

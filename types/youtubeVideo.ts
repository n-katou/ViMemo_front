import { Like } from './like';

export interface YoutubeVideo {
  id: number;
  title: string;
  published_at: string;
  youtube_id: string;
  duration: number;
  likes_count: number;
  notes_count: number;
  likes: Like[];
  formattedDuration?: string;
}

import { Like } from './like';
import { Note } from './note';

export interface YoutubeVideo {
  id: number;
  title: string;
  published_at: string;
  youtube_id: string;
  duration: number;
  likes_count: number;
  notes_count: number;
  likes: Like[];
  notes: Note[];
  sort_order?: number;  // sort_order プロパティを追加
  formattedDuration?: string;
  liked?: boolean;
  likeId?: number;
}

import { Note } from './note';
import { YoutubeVideo } from './youtubeVideo';

export interface Like {
  sort_order: any;
  id: number;
  title: string;
  likeable_type: string;
  likeable_id: number;
  likeable: Note | YoutubeVideo;
  created_at: string;
  updated_at: string;
  user_id: number;
  youtube_id?: string;
}

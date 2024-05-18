import { Note } from './note';
import { YoutubeVideo } from './youtubeVideo';

export interface Like {
  id: number;
  likeable_type: string;
  likeable_id: number;
  likeable: Note | YoutubeVideo;
  created_at: string;
  updated_at: string;
  user_id: number;
}

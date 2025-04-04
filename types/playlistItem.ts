import { YoutubeVideo } from './youtubeVideo';

export interface PlaylistItem {
  id: number;
  position: number;
  youtube_video: YoutubeVideo;
}

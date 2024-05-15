export interface Note {
    id: number;
    content: string;
    is_visible: boolean;
    video_timestamp?: string;
    user_id: number;
    youtube_video_id?: number;
    created_at: string;
    updated_at: string;
    video_id?: number;
    likes_count: number;
  }
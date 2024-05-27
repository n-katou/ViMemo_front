import { YoutubeVideo } from '../types/youtubeVideo';
import { Note } from '../types/note';
import { fetchYoutubeVideo, handleLike, handleUnlike, addNoteToVideo, deleteNoteFromVideo, editNoteInVideo } from './api';

// タイムスタンプを秒に変換する関数
export const videoTimestampToSeconds = (timestamp: string): number => {
  if (!timestamp) {
    console.error('Invalid timestamp: empty or null'); // タイムスタンプが無効な場合のエラーログ
    return 0;
  }

  const [minutes, seconds] = timestamp.split(':').map(Number);
  if (isNaN(minutes) || isNaN(seconds)) {
    console.error('Invalid timestamp format:', timestamp); // タイムスタンプのフォーマットが無効な場合のエラーログ
    return 0;
  }

  console.log('Converting timestamp:', timestamp); // タイムスタンプの変換をログに出力
  return minutes * 60 + seconds; // タイムスタンプを秒に変換して返す
};

// 指定した秒数から動画を再生する関数
export const playFromTimestamp = (seconds: number, playerRef: React.MutableRefObject<any>) => {
  if (playerRef.current) {
    playerRef.current.seekTo(seconds, true); // プレイヤーが存在する場合、指定した秒数から再生
  }
};

// 秒数を「分：秒」の形式にフォーマットする関数
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds}秒`; // 秒数を「分：秒」の形式にフォーマットして返す
};

// 動画IDとトークンを使用してノートを取得する関数
export const fetchNotes = async (videoId: number, token?: string): Promise<Note[]> => {
  try {
    const response = await fetchYoutubeVideo(videoId, token);
    return response.notes; // 取得したノートを返す
  } catch (error) {
    console.error('Failed to fetch notes:', error); // ノートの取得に失敗した場合のエラーログ
    return [];
  }
};

// 新しいノートを動画に追加する関数
export const addNote = async (
  newNoteContent: string,
  timestampMinutes: number,
  timestampSeconds: number,
  isVisible: boolean,
  jwtToken: string,
  video: YoutubeVideo,
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
): Promise<void> => {
  try {
    await addNoteToVideo(video.id, newNoteContent, timestampMinutes, timestampSeconds, isVisible, jwtToken);
    const notes = await fetchNotes(video.id, jwtToken);
    setNotes(notes); // ノートを追加後にノートリストを更新
  } catch (error) {
    console.error('Failed to add note:', error); // ノートの追加に失敗した場合のエラーログ
  }
};

// 指定したノートを動画から削除する関数
export const handleDeleteNote = async (
  noteId: number,
  jwtToken: string,
  video: YoutubeVideo,
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
): Promise<void> => {
  try {
    await deleteNoteFromVideo(video.id, noteId, jwtToken);
    const notes = await fetchNotes(video.id, jwtToken);
    setNotes(notes); // ノートを削除後にノートリストを更新
  } catch (error) {
    console.error('Failed to delete note:', error); // ノートの削除に失敗した場合のエラーログ
  }
};

// 指定したノートを編集する関数
export const handleEditNote = async (
  noteId: number,
  newContent: string,
  newMinutes: number,
  newSeconds: number,
  newIsVisible: boolean,
  jwtToken: string,
  video: YoutubeVideo,
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
): Promise<void> => {
  try {
    await editNoteInVideo(video.id, noteId, newContent, newMinutes, newSeconds, newIsVisible, jwtToken);
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId
          ? { ...note, content: newContent, video_timestamp: `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`, is_visible: newIsVisible }
          : note
      )
    ); // ノートを編集後にノートリストを更新
  } catch (error) {
    console.error('Failed to edit note:', error); // ノートの編集に失敗した場合のエラーログ
  }
};

// 動画にいいねを追加する関数
export const handleLikeVideo = async (
  video: YoutubeVideo,
  jwtToken: string,
  setVideo: React.Dispatch<React.SetStateAction<YoutubeVideo | null>>,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>,
  setLikeError: React.Dispatch<React.SetStateAction<string | null>>,
  currentUser: any
): Promise<void> => {
  try {
    const result = await handleLike(video.id, jwtToken);
    if (result.success) {
      const updatedVideo = await fetchYoutubeVideo(video.id, jwtToken);
      setVideo({ ...updatedVideo.youtube_video, formattedDuration: formatDuration(updatedVideo.youtube_video.duration) });

      const likes = updatedVideo.youtube_video.likes || [];
      setLiked(likes.some((like: { user_id: number }) => like.user_id === Number(currentUser?.id)));
      setLikeError(null);
    } else {
      setLikeError(result.error ?? null);
    }
  } catch (error) {
    console.error('Failed to like the video:', error); // いいねの追加に失敗した場合のエラーログ
    setLikeError('いいねに失敗しました。');
  }
};

// 動画のいいねを取り消す関数
export const handleUnlikeVideo = async (
  video: YoutubeVideo,
  jwtToken: string,
  setVideo: React.Dispatch<React.SetStateAction<YoutubeVideo | null>>,
  setLiked: React.Dispatch<React.SetStateAction<boolean>>,
  setLikeError: React.Dispatch<React.SetStateAction<string | null>>,
  currentUser: any
): Promise<void> => {
  const userLike = video?.likes ? video.likes.find((like: { user_id: number }) => like.user_id === Number(currentUser?.id)) : null;
  if (!userLike) {
    setLikeError('いいねが見つかりませんでした。');
    return;
  }

  try {
    const result = await handleUnlike(video.id, userLike.id, jwtToken);
    if (result.success) {
      const updatedVideo = await fetchYoutubeVideo(video.id, jwtToken);
      setVideo({ ...updatedVideo.youtube_video, formattedDuration: formatDuration(updatedVideo.youtube_video.duration) });

      const likes = updatedVideo.youtube_video.likes || [];
      setLiked(likes.some((like: { user_id: number }) => like.user_id === Number(currentUser?.id)));
      setLikeError(null);
    } else {
      setLikeError(result.error ?? null);
    }
  } catch (error) {
    console.error('Failed to unlike the video:', error); // いいねの取り消しに失敗した場合のエラーログ
    setLikeError('いいねの取り消しに失敗しました。');
  }
};

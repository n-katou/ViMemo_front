import { Note } from '../../types/note'; // Note 型をインポート
import { Like } from '../../types/like'; // Like 型をインポート
import { fetchCurrentUserLike, handleNoteLike, handleNoteUnlike } from '../../src/api'; // API 関数をインポート

export const initializeEditor = (
  note: Note,
  videoTimestampToSeconds: (timestamp: string) => number,
  setNewContent: (content: string) => void,
  setNewMinutes: (minutes: number) => void,
  setNewSeconds: (seconds: number) => void,
  setNewIsVisible: (isVisible: boolean) => void
) => {
  setNewContent(note.content);
  setNewMinutes(Math.floor(videoTimestampToSeconds(note.video_timestamp) / 60));
  setNewSeconds(videoTimestampToSeconds(note.video_timestamp) % 60);
  setNewIsVisible(note.is_visible);
};

export const handleLikeNote = async (
  videoId: number,
  note: Note,
  jwtToken: string,
  currentUser: any,
  setLiked: (liked: boolean) => void,
  setLikeError: (error: string | null) => void
) => {
  if (!currentUser || !jwtToken || !note) {
    console.error('JWT tokenやnoteが定義されていません');
    return;
  }

  try {
    const result = await handleNoteLike(videoId, note.id, jwtToken);
    if (result.success) {
      updateLikeState(note, true, result.like_id, currentUser);
      setLiked(true);
      setLikeError(null);
    } else {
      setLikeError(result.error ?? 'いいねに失敗しました。');
    }
  } catch (error) {
    console.error('Failed to like the note:', error);
    setLikeError('いいねに失敗しました。');
  }
};

export const handleUnlikeNote = async (
  videoId: number,
  note: Note,
  jwtToken: string,
  currentUser: any,
  setLiked: (liked: boolean) => void,
  setLikeError: (error: string | null) => void
) => {
  if (!currentUser || !jwtToken || !note) {
    console.error('JWT tokenやnoteが定義されていません');
    return;
  }

  try {
    const likeId = await fetchCurrentUserLike(videoId, note.id, jwtToken);
    if (!likeId) {
      setLikeError('いいねが見つかりませんでした。');
      return;
    }

    const result = await handleNoteUnlike(videoId, note.id, likeId, jwtToken);
    if (result.success) {
      updateLikeState(note, false, null, currentUser);
      setLiked(false);
      setLikeError(null);
    } else {
      setLikeError(result.error ?? 'いいねの取り消しに失敗しました。');
    }
  } catch (error) {
    console.error('Failed to unlike the note:', error);
    setLikeError('いいねの取り消しに失敗しました。');
  }
};

export const updateLikeState = (
  note: Note,
  isLiked: boolean,
  likeId: number | null,
  currentUser: any
) => {
  if (isLiked) {
    note.likes_count += 1;
    note.likes.push({
      id: likeId!,
      user_id: currentUser.id,
      likeable_id: note.id,
      likeable_type: 'Note',
    } as Like);
  } else {
    note.likes_count -= 1;
    note.likes = note.likes.filter((like) => like.user_id !== currentUser.id);
  }
};

export const padZero = (num: number) => num.toString().padStart(2, '0');

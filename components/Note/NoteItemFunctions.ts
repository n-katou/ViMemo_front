import { Note } from '../../types/note'; // Note 型をインポート
import { Like } from '../../types/like'; // Like 型をインポート
import { fetchCurrentUserLike, handleNoteLike, handleNoteUnlike } from '../../src/api'; // API 関数をインポート

/**
 * エディターの初期化関数
 * @param note メモのデータ
 * @param videoTimestampToSeconds タイムスタンプを秒に変換する関数
 * @param setNewContent メモの内容を設定する関数
 * @param setNewMinutes タイムスタンプの分を設定する関数
 * @param setNewSeconds タイムスタンプの秒を設定する関数
 * @param setNewIsVisible メモの表示/非表示を設定する関数
 */
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

/**
 * メモにいいねをする関数
 * @param videoId 動画のID
 * @param note メモのデータ
 * @param jwtToken JWT トークン
 * @param currentUser 現在のユーザー情報
 * @param setLiked いいねの状態を設定する関数
 * @param setLikeError いいねエラーの状態を設定する関数
 */
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

/**
 * メモのいいねを取り消す関数
 * @param videoId 動画のID
 * @param note メモのデータ
 * @param jwtToken JWT トークン
 * @param currentUser 現在のユーザー情報
 * @param setLiked いいねの状態を設定する関数
 * @param setLikeError いいねエラーの状態を設定する関数
 */
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

/**
 * いいねの状態を更新する関数
 * @param note メモのデータ
 * @param isLiked いいねの状態
 * @param likeId いいねのID
 * @param currentUser 現在のユーザー情報
 */
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

/**
 * 数値を2桁にパディングする関数
 * @param num 数値
 * @returns パディングされた文字列
 */
export const padZero = (num: number) => num.toString().padStart(2, '0');

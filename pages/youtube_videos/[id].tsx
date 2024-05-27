import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';
import { useAuth } from '../../context/AuthContext';
import NoteForm from '../../components/Note/NoteForm';
import NoteList from '../../components/Note/NoteList';
import YoutubeVideoDetails from '../../components/Youtube/YoutubeVideoDetails';
import LoadingSpinner from '../../components/LoadingSpinner';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { fetchYoutubeVideo } from '../../src/api';
import { addNote, handleDeleteNote, handleEditNote, handleLikeVideo, handleUnlikeVideo, videoTimestampToSeconds, playFromTimestamp, formatDuration } from '../../src/videoUtils';

const YoutubeVideoShowPage: React.FC = () => {
  // 状態変数の宣言: 動画データ、ノートリスト、いいねエラーメッセージ、いいね状態、ノートフォームの表示状態
  const [video, setVideo] = useState<YoutubeVideo & { formattedDuration?: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [isNoteFormVisible, setIsNoteFormVisible] = useState<boolean>(false);

  // ルーターとパス名を取得
  const pathname = usePathname();
  const router = useRouter();

  // 認証コンテキストから現在のユーザー、JWTトークン、ロード中の状態を取得
  const { currentUser, jwtToken, loading } = useAuth();

  // データロード中の状態変数
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  // YouTubeプレイヤーの参照を保持するためのref
  const playerRef = useRef<any>(null);

  // コンポーネントがマウントされたときに実行される副作用
  useEffect(() => {
    // パス名が存在しない場合のエラーハンドリング
    if (!pathname) {
      console.error('Pathname is null');
      return;
    }

    // パス名から動画IDを抽出
    const pathSegments = pathname.split('/');
    const videoId = parseInt(pathSegments[pathSegments.length - 1], 10);

    // 動画IDが有効であり、JWTトークンが存在する場合に動画データをフェッチ
    if (!isNaN(videoId) && jwtToken) {
      fetchYoutubeVideo(videoId, jwtToken)
        .then(videoData => {
          // 動画データとノートを設定
          setVideo({ ...videoData.youtube_video, formattedDuration: formatDuration(videoData.youtube_video.duration) });
          setNotes(videoData.notes);

          // ユーザーがいいねしているかどうかを設定
          const likes = videoData.youtube_video.likes || [];
          setLiked(likes.some((like: any) => like.user_id === Number(currentUser?.id)));
        })
        .catch(error => {
          console.error('Error loading the video:', error);
          setVideo(null);
        })
        .finally(() => {
          setDataLoading(false);
        });
    } else {
      console.error('Invalid videoId or missing jwtToken');
      setDataLoading(false);
    }
  }, [pathname, jwtToken, currentUser]);

  // ロード中のスピナー表示
  if (loading || dataLoading) {
    return <LoadingSpinner loading={loading || dataLoading} />;
  }

  return (
    <div className="container mx-auto py-8">
      {/* 動画が存在しない場合の表示 */}
      {!video && <div className="text-center">Video not found</div>}
      {video && (
        <>
          <div className="mb-8 sticky-video">
            {/* YouTube動画の詳細を表示 */}
            <YoutubeVideoDetails
              video={video as YoutubeVideo & { formattedDuration: string }}
              handleLike={currentUser && jwtToken ? () => handleLikeVideo(video, jwtToken, setVideo, setLiked, setLikeError, currentUser) : undefined}
              handleUnlike={currentUser && jwtToken ? () => handleUnlikeVideo(video, jwtToken, setVideo, setLiked, setLikeError, currentUser) : undefined}
              currentUser={currentUser}
              liked={liked}
              onPlayerReady={(player) => (playerRef.current = player)}
            />
            {/* いいねエラーの表示 */}
            {likeError && <div className="text-red-500 text-center mt-4">{likeError}</div>}
          </div>
          {/* ユーザーがログインしていてJWTトークンが存在する場合のノートフォームの表示 */}
          {currentUser && jwtToken && (
            <div className="mb-8">
              <button
                onClick={() => setIsNoteFormVisible(!isNoteFormVisible)}
                className="btn btn-primary mb-4 flex items-center"
              >
                {isNoteFormVisible ? <><CloseIcon className="mr-2" />投稿フォームを閉じる</> : <><AddIcon className="mr-2" />投稿フォームを開く</>}
              </button>
              {isNoteFormVisible && <NoteForm addNote={(content, minutes, seconds, isVisible) => addNote(content, minutes, seconds, isVisible, jwtToken, video, setNotes)} />}
            </div>
          )}
          {/* ノートリストの表示 */}
          <NoteList
            notes={notes}
            currentUser={currentUser}
            videoTimestampToSeconds={videoTimestampToSeconds}
            playFromTimestamp={(seconds) => playFromTimestamp(seconds, playerRef)}
            videoId={video.id}
            onDelete={currentUser && jwtToken ? (noteId) => handleDeleteNote(noteId, jwtToken, video, setNotes) : undefined}
            onEdit={currentUser && jwtToken ? (noteId, newContent, newMinutes, newSeconds, newIsVisible) => handleEditNote(noteId, newContent, newMinutes, newSeconds, newIsVisible, jwtToken, video, setNotes) : undefined}
          />
          <div className="text-left mt-8">
            {/* 戻るボタン */}
            <button
              className="btn btn-outline btn-blue"
              onClick={() => router.push('/youtube_videos')}
            >
              戻る
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default YoutubeVideoShowPage;

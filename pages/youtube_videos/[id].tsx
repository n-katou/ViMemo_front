import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';
import { useAuth } from '../../context/AuthContext';
import NoteForm from '../../components/Note/NoteForm';
import NoteList from '../../components/Note/NoteList';
import YoutubeVideoDetails from '../../components/Youtube/YoutubeVideoDetails';
import { fetchYoutubeVideo, handleLike, handleUnlike, addNoteToVideo, deleteNoteFromVideo, editNoteInVideo } from '../../src/api';
import { videoTimestampToSeconds, playFromTimestamp } from '../../src/utils';
import LoadingSpinner from '../../components/LoadingSpinner';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds}秒`;
};

const YoutubeVideoShowPage: React.FC = () => {
  const [video, setVideo] = useState<YoutubeVideo & { formattedDuration?: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [isNoteFormVisible, setIsNoteFormVisible] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, jwtToken, loading } = useAuth();
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const playerRef = useRef<any>(null);

  const fetchNotes = async (videoId: number, token?: string) => {
    try {
      const response = await fetchYoutubeVideo(videoId, token);
      setNotes(response.notes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const addNote = async (newNoteContent: string, timestampMinutes: number, timestampSeconds: number, isVisible: boolean): Promise<void> => {
    if (!jwtToken || !video) {
      console.error('JWT token or video is not defined');
      return;
    }

    try {
      await addNoteToVideo(video.id, newNoteContent, timestampMinutes, timestampSeconds, isVisible, jwtToken);
      await fetchNotes(video.id, jwtToken);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    if (!jwtToken || !video) {
      console.error('JWT token or video is not defined');
      return;
    }

    try {
      await deleteNoteFromVideo(video.id, noteId, jwtToken);
      await fetchNotes(video.id, jwtToken);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleEditNote = async (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => {
    if (!jwtToken || !video) {
      console.error('JWT token or video is not defined');
      return;
    }

    try {
      await editNoteInVideo(video.id, noteId, newContent, newMinutes, newSeconds, newIsVisible, jwtToken);
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId ? { ...note, content: newContent, video_timestamp: `${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`, is_visible: newIsVisible } : note
        )
      );
    } catch (error) {
      console.error('Failed to edit note:', error);
    }
  };

  const handleLikeVideo = async () => {
    if (!jwtToken || !video) {
      console.error('JWT tokenやvideoが定義されていません');
      return;
    }

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
      console.error('Failed to like the video:', error);
      setLikeError('いいねに失敗しました。');
    }
  };

  const handleUnlikeVideo = async () => {
    if (!jwtToken || !video) {
      console.error('JWT tokenやvideoが定義されていません');
      return;
    }

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
      console.error('Failed to unlike the video:', error);
      setLikeError('いいねの取り消しに失敗しました。');
    }
  };

  const playFromTimestamp = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds, true);
    }
  };

  const onPlayerReady = (player: any) => {
    playerRef.current = player;
  };

  useEffect(() => {
    if (!pathname) {
      console.error('Pathname is null');
      return;
    }

    const pathSegments = pathname.split('/');
    const videoId = parseInt(pathSegments[pathSegments.length - 1], 10);

    if (!isNaN(videoId)) {
      fetchYoutubeVideo(videoId, jwtToken)
        .then(videoData => {
          setVideo({ ...videoData.youtube_video, formattedDuration: formatDuration(videoData.youtube_video.duration) });
          setNotes(videoData.notes);

          const likes = videoData.youtube_video.likes || [];
          setLiked(likes.some((like: { user_id: number }) => like.user_id === Number(currentUser?.id)));
        })
        .catch(error => {
          console.error('Error loading the video:', error);
          setVideo(null);
        })
        .finally(() => {
          setDataLoading(false);
        });
    } else {
      console.error('Invalid videoId');
      setDataLoading(false);
    }
  }, [pathname, jwtToken, currentUser]);

  if (loading || dataLoading) {
    return <LoadingSpinner loading={loading || dataLoading} />;
  }

  return (
    <div className="container mx-auto py-8">
      {!video && <div className="text-center">Video not found</div>}
      {video && (
        <>
          <div className="mb-8 sticky-video">
            <YoutubeVideoDetails
              video={video as YoutubeVideo & { formattedDuration: string }}
              handleLike={currentUser ? handleLikeVideo : undefined}
              handleUnlike={currentUser ? handleUnlikeVideo : undefined}
              currentUser={currentUser}
              liked={liked}
              onPlayerReady={onPlayerReady}
            />
            {likeError && <div className="text-red-500 text-center mt-4">{likeError}</div>}
          </div>
          {currentUser && (
            <div className="mb-8">
              <button
                onClick={() => setIsNoteFormVisible(!isNoteFormVisible)}
                className="btn btn-primary mb-4 flex items-center"
              >
                {isNoteFormVisible ? <><CloseIcon className="mr-2" />投稿フォームを閉じる</> : <><AddIcon className="mr-2" />投稿フォームを開く</>}
              </button>
              {isNoteFormVisible && <NoteForm addNote={addNote} />}
            </div>
          )}
          <NoteList
            notes={notes}
            currentUser={currentUser}
            videoTimestampToSeconds={videoTimestampToSeconds}
            playFromTimestamp={playFromTimestamp}
            videoId={video.id}
            onDelete={currentUser ? handleDeleteNote : undefined}
            onEdit={currentUser ? handleEditNote : undefined}
          />
          <div className="text-left mt-8">
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

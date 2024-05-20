// YoutubeVideoShowPage.tsx
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';
import { useAuth } from '../../context/AuthContext';
import NoteForm from '../../components/Note/NoteForm';
import NoteList from '../../components/Note/NoteList';
import YoutubeVideoDetails from '../../components/Youtube/YoutubeVideoDetails';
import { fetchYoutubeVideo, handleLike, handleUnlike, addNoteToVideo, deleteNoteFromVideo, editNoteInVideo } from '../../src/api';
import { videoTimestampToSeconds, playFromTimestamp } from '../../src/utils';

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
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, jwtToken, loading } = useAuth();

  const fetchNotes = async (videoId: number, jwtToken: string) => {
    try {
      const response = await fetchYoutubeVideo(videoId, jwtToken);
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
      console.log('Like result:', result);
      if (result.success) {
        const updatedVideo = await fetchYoutubeVideo(video.id, jwtToken);
        console.log('Updated video:', updatedVideo);
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
      console.log('Unlike result:', result);
      if (result.success) {
        const updatedVideo = await fetchYoutubeVideo(video.id, jwtToken);
        console.log('Updated video:', updatedVideo);
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

  useEffect(() => {
    if (!currentUser && !loading) {
      router.push('/login');
      return;
    }

    if (!pathname) {
      console.error('Pathname is null');
      return;
    }

    const pathSegments = pathname.split('/');
    const videoId = parseInt(pathSegments[pathSegments.length - 1], 10);

    if (!isNaN(videoId) && jwtToken) {
      console.log('JWT Token:', jwtToken);
      fetchYoutubeVideo(videoId, jwtToken)
        .then(videoData => {
          console.log('Fetched videoData:', videoData);
          setVideo({ ...videoData.youtube_video, formattedDuration: formatDuration(videoData.youtube_video.duration) }); // フォーマットされた時間を追加
          setNotes(videoData.notes);

          const likes = videoData.youtube_video.likes || [];
          setLiked(likes.some((like: { user_id: number }) => like.user_id === Number(currentUser?.id)));
        })
        .catch(error => {
          console.error('Error loading the video:', error);
          setVideo(null);
        });
    } else {
      console.error('Invalid videoId or missing jwtToken');
    }
  }, [pathname, jwtToken, currentUser, loading]);

  return (
    <div className="container mx-auto py-8">
      {loading && <div className="text-center">Loading...</div>}
      {!loading && !video && <div className="text-center">Video not found</div>}
      {!loading && video && (
        <>
          <div className="mb-8">
            <YoutubeVideoDetails
              video={video as YoutubeVideo & { formattedDuration: string }}
              handleLike={handleLikeVideo}
              handleUnlike={handleUnlikeVideo}
              currentUser={currentUser}
              liked={liked}
            />
            {likeError && <div className="text-red-500 text-center mt-4">{likeError}</div>}
          </div>
          {currentUser && (
            <div className="mb-8">
              <NoteForm addNote={addNote} />
            </div>
          )}
          <NoteList
            notes={notes}
            currentUser={currentUser}
            videoTimestampToSeconds={videoTimestampToSeconds}
            playFromTimestamp={playFromTimestamp}
            videoId={video.id}
            onDelete={handleDeleteNote}
            onEdit={handleEditNote}
          />
          <div className="text-center mt-8">
            <button
              className="btn btn-outline btn-info"
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

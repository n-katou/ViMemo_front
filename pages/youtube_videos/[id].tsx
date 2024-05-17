import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';
import { CustomUser } from '../../types/user';
import { useAuth } from '../../context/AuthContext';
import NoteForm from '../../components/Note/NoteForm';
import NoteList from '../../components/Note/NoteList';
import YoutubeVideoDetails from '../../components/Youtube/YoutubeVideoDetails';
import axios from 'axios';
import { fetchYoutubeVideo, handleLike, handleUnlike } from '../../src/api';
import { videoTimestampToSeconds, playFromTimestamp } from '../../src/utils';

const YoutubeVideoShowPage: React.FC = () => {
  const [video, setVideo] = useState<YoutubeVideo | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, jwtToken, loading } = useAuth();

  const fetchNotes = async (videoId: number, jwtToken: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}`,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
          }
        }
      );
      console.log('Fetched notes:', response.data.notes);
      setNotes(response.data.notes);
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
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${video.id}/notes`,
        { content: newNoteContent, video_timestamp_minutes: timestampMinutes, video_timestamp_seconds: timestampSeconds, is_visible: isVisible },
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

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
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${video.id}/notes/${noteId}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

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
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${video.id}/notes/${noteId}`,
        { content: newContent, video_timestamp_minutes: newMinutes, video_timestamp_seconds: newSeconds, is_visible: newIsVisible },
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

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
      console.error('JWT token or video is not defined');
      return;
    }

    try {
      const result = await handleLike(video.id, jwtToken);
      console.log('Like result:', result);
      if (result.success) {
        const updatedVideo = await fetchYoutubeVideo(video.id, jwtToken);
        setVideo(updatedVideo.youtube_video);

        // likes プロパティが存在しない場合のデフォルト値設定
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
        setVideo(updatedVideo.youtube_video);

        // likes プロパティが存在しない場合のデフォルト値設定
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
          setVideo(videoData.youtube_video);
          console.log('Fetched video:', videoData.youtube_video);
          setNotes(videoData.notes);
          console.log('Fetched notes:', videoData.notes);
          setLiked(videoData.youtube_video.likes.some((like: { user_id: number }) => like.user_id === Number(currentUser?.id)));
        })
        .catch(error => console.error('Error loading the video:', error));
    } else {
      console.error('Invalid videoId or missing jwtToken');
    }
  }, [pathname, jwtToken, currentUser, loading]);

  return (
    <div className="container">
      {loading && <div>Loading...</div>}
      {!loading && !video && <div>Video not found</div>}
      {!loading && video && (
        <>
          <YoutubeVideoDetails
            video={video}
            handleLike={handleLikeVideo}
            handleUnlike={handleUnlikeVideo}
            currentUser={currentUser}
            liked={liked}
          />
          {likeError && <div className="error-message">{likeError}</div>}
          {currentUser ? (
            <>
              <NoteForm addNote={addNote} />
            </>
          ) : (
            <p>No user is logged in.</p>
          )}
          <NoteList
            notes={notes}
            currentUser={currentUser}
            videoTimestampToSeconds={videoTimestampToSeconds}
            playFromTimestamp={playFromTimestamp}
            videoId={video.youtube_id}
            onDelete={handleDeleteNote}
            onEdit={handleEditNote}
          />
          <button
            className="btn btn-outline btn-info"
            style={{ marginTop: '20px' }}
            onClick={() => router.push('/youtube_videos')}
          >
            戻る
          </button>
        </>
      )}
    </div>
  );
};

export default YoutubeVideoShowPage;

"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';
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
      console.log('Fetched notes:', response.data.notes); // デバッグ情報を追加
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

      await fetchNotes(video.id, jwtToken); // ノートを追加後に再fetch

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

      await fetchNotes(video.id, jwtToken); // ノートを削除後に再fetch

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
      fetchYoutubeVideo(videoId, jwtToken)
        .then(videoData => {
          setVideo(videoData.youtube_video);
          console.log('Fetched video:', videoData.youtube_video); // デバッグ情報を追加
          setNotes(videoData.notes);
          console.log('Fetched notes:', videoData.notes); // デバッグ情報を追加
        })
        .catch(error => console.error('Error loading the video:', error));
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
            handleLike={() => handleLike(video.id, jwtToken)}
            handleUnlike={() => handleUnlike(video.id, jwtToken)}
            currentUser={currentUser}
          />
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

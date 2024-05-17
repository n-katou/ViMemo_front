"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';
import { useAuth } from '../../context/AuthContext';
import NoteForm from '../../components/NoteForm';
import NoteList from '../../components/NoteList';
import YoutubeVideoDetails from '../../components/YoutubeVideoDetails';
import axios from 'axios';
import { fetchYoutubeVideo, handleLike, handleUnlike } from '../../src/api';
import { videoTimestampToSeconds, playFromTimestamp } from '../../src/utils';

const YoutubeVideoShowPage: React.FC = () => {
  const [video, setVideo] = useState<YoutubeVideo | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, jwtToken, loading } = useAuth();

  const addNote = async (newNoteContent: string, timestampMinutes: number, timestampSeconds: number): Promise<void> => {
    if (!jwtToken || !video) {
      console.error('JWT token or video is not defined');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${video.id}/notes`,
        { content: newNoteContent, video_timestamp_minutes: timestampMinutes, video_timestamp_seconds: timestampSeconds },
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const newNote = {
        ...response.data,
        user: currentUser // currentUserオブジェクト全体を追加
      };

      setNotes(prevNotes => [...prevNotes, newNote]);
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

      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleEditNote = async (noteId: number, newContent: string) => {
    if (!jwtToken || !video) {
      console.error('JWT token or video is not defined');
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${video.id}/notes/${noteId}`,
        { content: newContent },
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setNotes(prevNotes => prevNotes.map(note => note.id === noteId ? { ...note, content: newContent } : note));
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
          setNotes(videoData.notes);
          console.log('Video data loaded', videoData);
          console.log('Notes data:', videoData.notes);
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

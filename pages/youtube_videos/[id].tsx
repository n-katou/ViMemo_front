"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';
import { useAuth } from '../../context/AuthContext';
import NoteForm from '../../components/NoteForm';
import NoteItem from '../../components/NoteItem';
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
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

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
          <div>
            {notes.length > 0 ? (
              notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  currentUser={currentUser}
                  videoTimestampToSeconds={videoTimestampToSeconds}
                  playFromTimestamp={playFromTimestamp}
                  videoId={video.youtube_id}
                  onDelete={handleDeleteNote}
                />
              ))
            ) : (
              <p>No notes available.</p>
            )}
          </div>
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

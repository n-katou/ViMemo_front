"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';
import { useAuth } from '../../context/AuthContext';
import NoteForm from '../../components/NoteForm';
import axios from 'axios';

async function fetchYoutubeVideo(id: number, jwtToken: string) {
  const headers: { [key: string]: string } = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${jwtToken}`,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${id}`, {
    headers: headers,
  });

  if (!res.ok) {
    throw new Error(`Error fetching video with ID ${id}`);
  }

  const data = await res.json();
  return data;
}

const YoutubeVideoShowPage = () => {
  const [video, setVideo] = useState<YoutubeVideo | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, jwtToken, loading } = useAuth();

  const addNote = async (newNoteContent: string): Promise<void> => {
    if (!jwtToken || !video) {
      console.error('JWT token or video is not defined');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${video.id}/notes`,
        { content: newNoteContent },
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setNotes(prevNotes => [...prevNotes, response.data]);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  useEffect(() => {
    if (!currentUser && !loading) {
      router.push('/login');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <>
      <div>
        <h1>{video.title || "タイトル不明"}</h1>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${video.youtube_id}`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
        <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
        <p>動画時間: {video.duration}分</p>
      </div>
      <div>
        {currentUser ? (
          <>
            <p>Current User: {currentUser.email}</p>
            <NoteForm addNote={addNote} />
          </>
        ) : (
          <p>No user is logged in.</p>
        )}
        <div>
          {notes.length > 0 ? (
            notes.map((note) => (
              <div key={note.id}>
                <p>{note.content}</p>
                <p>{new Date(note.created_at).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No notes available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default YoutubeVideoShowPage;

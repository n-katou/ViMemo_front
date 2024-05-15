"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import NoteForm from '../../components/NoteForm';
import axios from 'axios';

async function fetchYoutubeVideo(id: number, token?: string) {
  const headers: { [key: string]: string } = {
    'Accept': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`https://vimemo.fly.dev/api/v1/youtube_videos/${id}`, {
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
  const pathname = usePathname();
  const { currentUser, loading } = useFirebaseAuth();

  const [notes, setNotes] = useState<any[]>([]);
  const addNote = async (newNoteContent: string): Promise<void> => {
    if (!currentUser || !video) {
      console.error('User or video is not defined');
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const response = await axios.post(
        `https://vimemo.fly.dev/api/v1/youtube_videos/${video.id}/notes`,
        { content: newNoteContent },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
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
    const pathSegments = pathname.split('/');
    const videoId = parseInt(pathSegments[pathSegments.length - 1], 10);

    if (!isNaN(videoId)) {
      const fetchVideo = async () => {
        let token;
        if (currentUser) {
          token = await currentUser.getIdToken();
        }
        fetchYoutubeVideo(videoId, token)
          .then(videoData => {
            setVideo(videoData.youtube_video);
            console.log('Video data loaded', videoData);
          })
          .catch(error => console.error('Error loading the video:', error));
      };
      fetchVideo();
    }
  }, [pathname, currentUser]);

  useEffect(() => {
    console.log('Current User:', currentUser);
    console.log('Video:', video);
  }, [currentUser, video]);

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
          {notes.map((note, index) => (
            <p key={index}>{note.content}</p>
          ))}
        </div>
      </div>
    </>
  );
};

export default YoutubeVideoShowPage;

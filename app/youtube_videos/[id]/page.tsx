"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { useFirebaseAuth } from '../../hooks/useFirebaseAuth';
import NoteForm from '../../../components/NoteForm';
import axios from 'axios';

async function fetchYoutubeVideo(id: number, token: string) {
  const res = await fetch(`https://vimemo.fly.dev/api/v1/youtube_videos/${id}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
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
  const { user } = useFirebaseAuth();

  const [notes, setNotes] = useState<any[]>([]);  // ノートオブジェクトを保存するための型を `any[]` に変更
  const addNote = async (newNoteContent: string): Promise<void> => {
    if (!user || !video) {
      console.error('User or video is not defined');
      return;
    }

    try {
      const token = await user.getIdToken();
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

      setNotes(prevNotes => [...prevNotes, response.data]);  // レスポンスデータを配列に追加
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  useEffect(() => {
    const pathSegments = pathname.split('/');
    const videoId = parseInt(pathSegments[pathSegments.length - 1], 10);

    if (!isNaN(videoId) && user) {
      user.getIdToken().then(token => {
        fetchYoutubeVideo(videoId, token)
          .then(videoData => {
            setVideo(videoData.youtube_video);
          })
          .catch(error => console.error('Error loading the video:', error));
      });
    }
  }, [pathname, user]);

  if (!user) {
    return <div>Please log in to view this video.</div>;
  }

  if (!video) {
    return <div>Loading...</div>;
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
        <NoteForm addNote={addNote} />
        <div>
          {notes.map((note, index) => (
            <p key={index}>{note.content}</p> // `note.content` を表示するように修正
          ))}
        </div>
      </div>
    </>
  );
};

export default YoutubeVideoShowPage;

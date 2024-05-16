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

      setNotes(prevNotes => [...prevNotes, response.data]);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleLike = async (videoId: number) => {
    // いいねを追加する処理を実装
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/likes`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // 必要に応じて状態を更新
      setVideo(prevVideo => {
        if (prevVideo) {
          return { ...prevVideo, likes_count: prevVideo.likes_count + 1 };
        }
        return prevVideo;
      });
    } catch (error) {
      console.error('Failed to like the video:', error);
    }
  };

  const handleUnlike = async (videoId: number) => {
    // いいねを取り消す処理を実装
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/likes`,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      // 必要に応じて状態を更新
      setVideo(prevVideo => {
        if (prevVideo) {
          return { ...prevVideo, likes_count: prevVideo.likes_count - 1 };
        }
        return prevVideo;
      });
    } catch (error) {
      console.error('Failed to unlike the video:', error);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <div className="container">
      <h1 className="video-title">{video.title || "タイトル不明"}</h1>
      <div className="video-wrapper">
        <iframe
          className="w-full aspect-video"
          id="youtube-video"
          src={`https://www.youtube.com/embed/${video.youtube_id}?playsinline=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
      <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
      <p>動画時間: {video.duration}分</p>

      <div id={`like_button_${video.id}`}>
        {currentUser ? (
          <button
            className="btn btn-outline btn-warning"
            onClick={() => handleLike(video.id)}
          >
            いいね ({video.likes_count})
          </button>
        ) : (
          <button
            className="btn btn-outline btn-success"
            onClick={() => handleUnlike(video.id)}
          >
            いいねを取り消す ({video.likes_count})
          </button>
        )}
      </div>

      {currentUser ? (
        <>
          <p>Current User: {currentUser.email}</p>
          <NoteForm addNote={addNote} />
        </>
      ) : (
        <p>No user is logged in.</p>
      )}

      <div id="notes_list">
        <h2 style={{ marginTop: '20px' }}>メモ一覧</h2>
        {notes.length > 0 ? (
          <div className="flex flex-wrap">
            {notes.map((note) => (
              <div key={note.id} className="p-2 flex lg:max-w-1/3">
                <div>
                  <p>{note.content}</p>
                  <p>{new Date(note.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p id="no_notes_message">メモがありません。</p>
        )}
      </div>
      <button
        className="btn btn-outline btn-info"
        style={{ marginTop: '20px' }}
        onClick={() => router.push('/youtube_videos')}
      >
        戻る
      </button>
    </div>
  );
};

export default YoutubeVideoShowPage;

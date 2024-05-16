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

  const videoTimestampToSeconds = (timestamp: string) => {
    const [minutes, seconds] = timestamp.split(':').map(Number);
    return minutes * 60 + seconds;
  };

  const playFromTimestamp = (seconds: number) => {
    const videoUrl = `https://www.youtube.com/embed/${video?.youtube_id}?start=${seconds}&autoplay=1`;
    const videoFrame = document.getElementById('youtube-video') as HTMLIFrameElement;
    videoFrame.src = videoUrl;
    videoFrame.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
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
              <div key={note.id} className="p-2 flex-1 lg:max-w-1/3">
                <div className="card mx-auto w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 mb-3">
                  <div className="card-body">
                    {note.user?.avatar?.url ? (
                      <img src={note.user.avatar.url} alt="User Avatar" width="100" height="100" />
                    ) : (
                      <div>No Avatar</div>
                    )}
                    <p>
                      <span className="font-bold">ユーザー名:</span>
                      {note.user?.name || 'Unknown User'}
                    </p>
                    <p>
                      <span className="font-bold">タイムスタンプ:</span>
                      <button
                        onClick={() => playFromTimestamp(videoTimestampToSeconds(note.video_timestamp))}
                        className="btn btn-outline link-hover"
                      >
                        {note.video_timestamp}
                      </button>
                    </p>
                    <p>
                      <span className="font-bold">メモ:</span>
                      {note.content}
                    </p>
                    <p>
                      {/* いいねのカウントのレンダリングを追加 */}
                      いいね: {note.likes_count}
                    </p>
                    {!note.is_visible && (
                      <p><span className="badge badge-error">非表示中</span></p>
                    )}
                    <div className="card-actions">
                      {note.youtube_video_id && (
                        <button className="btn btn-outline btn-primary">
                          いいね {/* いいねボタンの実装をここに追加 */}
                        </button>
                      )}
                      {currentUser?.id === note.user?.id && (
                        <>
                          <a href={`https://x.com/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`【シェア】\nタイムスタンプ: ${note.video_timestamp} \nメモ: ${note.content} \nYouTube: https://www.youtube.com/watch?v=${video.youtube_id}&t=${videoTimestampToSeconds(note.video_timestamp)}s`)}`} target="_blank" className="btn btn-outline btn-primary">
                            Xでシェア
                          </a>
                          <button className="btn btn-outline btn-info">
                            編集 {/* 編集ボタンの実装をここに追加 */}
                          </button>
                          <button className="btn btn-outline btn-error">
                            削除 {/* 削除ボタンの実装をここに追加 */}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
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

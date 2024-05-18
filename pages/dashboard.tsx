// pages/dashboard.tsx
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Like } from '../types/like';
import { Note } from '../types/note';
import { CustomUser } from '../types/user';

const Dashboard = () => {
  const { currentUser, loading } = useAuth();
  const [youtubeVideoLikes, setYoutubeVideoLikes] = useState<Like[]>([]);
  const [noteLikes, setNoteLikes] = useState<Like[]>([]);
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const response = await axios.get('/api/mypage', {
          headers: {
            Authorization: `Bearer ${(currentUser as CustomUser).token}`,
          },
        });

        const { youtube_video_likes, note_likes, youtube_playlist_url } = response.data;
        setYoutubeVideoLikes(youtube_video_likes);
        setNoteLikes(note_likes);
        setYoutubePlaylistUrl(youtube_playlist_url);
      } catch (error) {
        console.error('Error fetching mypage data:', error);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <div className="container px-4 w-full">
      <div className="flex flex-col md:flex-row">
        <div className="mr-10 mb-3">
          <ul className="nav flex-col">
            <li className="nav-item mb-3">
              Avatar
              <img src={(currentUser as CustomUser).avatar} alt="Avatar" width="100" height="100" />
            </li>
            <li className="nav-item mb-3">
              Name
              {(currentUser as CustomUser).name}
            </li>
            <li className="nav-item mb-3">
              Email
              {currentUser.email}
            </li>
            <li className="nav-item mb-3">
              <Link href="/mypage/edit" legacyBehavior>
                <a className="btn btn-outline btn-success">Edit</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users" legacyBehavior>
                <a className="btn btn-outline">会員一覧</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex-1 flex-auto lg:pr-4 md:pr-2 pr-1">
          <h1 className="text-xl font-bold mb-4">「いいね」した動画プレイリスト</h1>
          {youtubeVideoLikes.length > 0 ? (
            <div className="mb-4 video-wrapper">
              <iframe className="aspect-video" src={youtubePlaylistUrl} frameBorder="0" allowFullScreen></iframe>
            </div>
          ) : (
            <p>いいねした動画がありません。</p>
          )}

          <h1 className="text-xl font-bold mb-4">最新「いいね」したメモ一覧</h1>
          {noteLikes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {noteLikes.map((like) => {
                const note = like.likeable as Note;
                return (
                  <div key={note.id} className="col-span-1">
                    <div className="card bg-base-100 shadow-xl mb-3">
                      <div className="card-body">
                        <img src={note.user.avatar} alt="User Avatar" width="100" height="100" />
                        <p>
                          <span className="font-bold">ユーザー名:</span> {note.user.name}
                        </p>
                        <p>メモ内容：{note.content}</p>
                        <p>{note.likes_count}</p>
                        {!note.is_visible && <p><span className="badge badge-error">非表示中</span></p>}
                        {currentUser && <button>Like Button</button>}
                        {note.youtube_video_id && (
                          <div className="card-actions">
                            <Link href={`/youtube_videos/${note.youtube_video_id}`} legacyBehavior>
                              <a className="btn btn-primary">この動画を見る</a>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>いいねしたメモがありません。</p>
          )}
        </div>
      </div>

      <style jsx>{`
        .video-wrapper {
          position: relative;
          padding-top: 56.25%;
          height: 0;
          overflow: hidden;
        }

        .video-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

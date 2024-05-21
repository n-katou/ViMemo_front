// pages/dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useAuth } from '../context/AuthContext';
import { Like } from '../types/like';
import { Note } from '../types/note';
import { CustomUser } from '../types/user';
import axios from 'axios';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LoadingSpinner from '../components/LoadingSpinner';  // LoadingSpinner をインポート

function isNote(likeable: any): likeable is Note {
  return likeable !== undefined && (likeable as Note).content !== undefined;
}

const Dashboard = () => {
  const { currentUser, jwtToken, loading, setAuthState } = useAuth();
  const router = useRouter();
  const [youtubeVideoLikes, setYoutubeVideoLikes] = useState<Like[]>([]);
  const [noteLikes, setNoteLikes] = useState<Like[]>([]);
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data...');

      if (!jwtToken) {
        console.error('Token is undefined');
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mypage`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        console.log('Response data:', response.data);

        const { youtube_video_likes, note_likes, youtube_playlist_url, avatar_url, role, email, name } = response.data;
        setYoutubeVideoLikes(youtube_video_likes);
        setNoteLikes(note_likes);
        setYoutubePlaylistUrl(youtube_playlist_url);

        // currentUserにavatar_url, role, email, nameを追加
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            avatar_url,
            role,
            email,
            name,
          } as CustomUser;

          setAuthState({
            currentUser: updatedUser,
            jwtToken,
          });
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }

        console.log('Updated currentUser:', currentUser);
        console.log('Fetched Note Likes:', note_likes);
      } catch (error) {
        console.error('Error fetching mypage data:', error);
      }
    };

    fetchData();
  }, [jwtToken, setAuthState]);

  const fetchVideosByGenre = async (genre: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/fetch_videos_by_genre`, {
        params: { genre },
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.status === 200) {
        const youtubeVideosData = response.data;
        setYoutubeVideos(youtubeVideosData);
        console.log('Fetched YouTube Videos:', youtubeVideosData);

        router.push(`/youtube_videos`);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching YouTube videos:', error.response?.data || error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchVideosByGenre(searchQuery);
  };

  if (loading) {
    return <LoadingSpinner loading={loading} />; // LoadingSpinner を使用
  }

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Please log in to access the dashboard.</p></div>;
  }

  const isAdmin = currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  console.log('Current User:', currentUser);
  console.log('Current User Role:', currentUser.role);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-8 md:mb-0">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="flex items-center mb-4">
              {currentUser.avatar_url && (
                <img
                  src={currentUser.avatar_url}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full mr-4"
                />
              )}
              <div className="text-container">
                <h2 className="text-xl font-bold text-wrap">{currentUser.name}</h2>
                <p className="text-gray-600 text-wrap">{currentUser.email}</p>
              </div>
            </div>
            <Link href="/mypage/edit" legacyBehavior>
              <a className="block text-center bg-green-500 text-white py-2 rounded-lg mt-4">ユーザー編集</a>
            </Link>
            {isAdmin && (
              <Link href={`${process.env.NEXT_PUBLIC_API_URL}/admin/users`} legacyBehavior>
                <a className="block text-center bg-blue-500 text-white py-2 rounded-lg mt-4">会員一覧</a>
              </Link>
            )}
          </div>
        </div>

        <div className="w-full md:flex-1 md:pl-8">
          {currentUser.role === 'admin' && (
            <>
              <form onSubmit={handleSearch} className="mb-8">
                <Box display="flex" alignItems="center" mb={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="キーワードで動画を取得"
                  />
                  <Button type="submit" variant="contained" color="primary" sx={{ ml: 2 }}>
                    取得
                  </Button>
                </Box>
              </form>

              {youtubeVideos.length > 0 && (
                <div className="mb-8">
                  <h1 className="text-2xl font-bold mb-4">取得したYouTube動画</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {youtubeVideos.map((video, index) => (
                      <div key={video.id} className="col-span-1">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${video.youtube_id}`}
                            frameBorder="0"
                            allowFullScreen
                            className="w-full h-48"
                          ></iframe>
                          <div className="p-4">
                            <h2 className="text-lg font-bold">{video.title}</h2>
                            <p className="text-gray-600">公開日: {new Date(video.published_at).toLocaleDateString()}</p>
                            <p className="text-gray-600">動画時間: {video.duration}秒</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <h1 className="text-2xl font-bold mb-4">「いいね」した動画プレイリスト</h1>
          {youtubeVideoLikes.length > 0 ? (
            <div className="mb-4 video-wrapper">
              <iframe
                src={youtubePlaylistUrl}
                frameBorder="0"
                allowFullScreen
                className="w-full aspect-video"
              ></iframe>
            </div>
          ) : (
            <p>いいねした動画がありません。</p>
          )}

          <h1 className="text-2xl font-bold mb-4">最新「いいね」したメモ一覧</h1>
          {noteLikes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {noteLikes.map((like, index) => {
                if (like.likeable && isNote(like.likeable)) {
                  const note = like.likeable;
                  console.log('Rendering Note:', note);
                  return (
                    <div key={note.id} className="col-span-1">
                      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="p-4">
                          {note.user && (
                            <div className="flex items-center mb-4">
                              {note.user.avatar_url && (
                                <img
                                  src={note.user.avatar_url}
                                  alt="User Avatar"
                                  className="w-12 h-12 rounded-full mr-4"
                                />
                              )}
                              <div>
                                <p className="font-bold">{note.user.name}</p>
                              </div>
                            </div>
                          )}
                          <p className="text-gray-800 mb-2">メモ内容：{note.content}</p>
                          <p className="text-gray-600">いいね数：{note.likes_count}</p>
                          {note.youtube_video_id && (
                            <div className="mt-4">
                              <Link href={`/youtube_videos/${note.youtube_video_id}`} legacyBehavior>
                                <a className="text-blue-500">この動画を見る</a>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <p>いいねしたメモがありません。</p>
          )}
        </div>
      </div>
      <style jsx>{`
        .text-container {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .text-wrap {
          word-wrap: break-word;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

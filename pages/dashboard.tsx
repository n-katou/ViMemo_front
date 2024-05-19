import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Like } from '../types/like';
import { Note } from '../types/note';
import { CustomUser } from '../types/user';
import { YoutubeVideo } from '../types/youtubeVideo';

function isNote(likeable: any): likeable is Note {
  return likeable !== undefined && (likeable as Note).content !== undefined;
}

const Dashboard = () => {
  const { currentUser, jwtToken, loading } = useAuth();
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

        const { youtube_video_likes, note_likes, youtube_playlist_url, avatar_url, role } = response.data;
        setYoutubeVideoLikes(youtube_video_likes);
        setNoteLikes(note_likes);
        setYoutubePlaylistUrl(youtube_playlist_url);

        // currentUserにavatar_urlとroleを追加
        if (currentUser) {
          (currentUser as CustomUser).avatar_url = avatar_url;
          (currentUser as CustomUser).role = role; // roleを追加
        }

        // ノートのデータをログに出力して確認
        console.log('Fetched Note Likes:', note_likes);
      } catch (error) {
        console.error('Error fetching mypage data:', error);
      }
    };

    fetchData();
  }, [jwtToken, currentUser]);

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

        router.push(`/youtube_videos?query=${encodeURIComponent(genre)}`);
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
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Loading...</p></div>;
  }

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">Please log in to access the dashboard.</p></div>;
  }

  const isAdmin = currentUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // ログ出力
  console.log('Current User:', currentUser);
  console.log('Current User Role:', (currentUser as CustomUser).role);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-8 md:mb-0">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="flex items-center mb-4">
              {(currentUser as CustomUser).avatar_url && (
                <img
                  src={(currentUser as CustomUser).avatar_url}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full mr-4"
                />
              )}
              <div>
                <h2 className="text-xl font-bold">{currentUser.name}</h2>
                <p className="text-gray-600">{currentUser.email}</p>
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
          {(currentUser as CustomUser).role === 'admin' && (
            <>
              <form onSubmit={handleSearch} className="mb-8">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ジャンル or キーワードで動画を取得"
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg"
                  />
                  <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg">取得</button>
                </div>
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
                  console.log('Rendering Note:', note); // デバッグログ
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
    </div>
  );
};

export default Dashboard;

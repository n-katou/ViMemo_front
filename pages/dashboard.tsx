import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Like } from '../types/like';
import { Note } from '../types/note';
import { CustomUser } from '../types/user';
import { YoutubeVideo } from '../types/youtubeVideo'; // YouTubeVideo型をインポート

// 型ガード関数を追加
function isNote(likeable: any): likeable is Note {
  return likeable !== undefined && (likeable as Note).content !== undefined;
}

const Dashboard = () => {
  const { currentUser, jwtToken, loading } = useAuth();
  const [youtubeVideoLikes, setYoutubeVideoLikes] = useState<Like[]>([]);
  const [noteLikes, setNoteLikes] = useState<Like[]>([]);
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]); // YouTube動画の型を指定
  const [searchQuery, setSearchQuery] = useState(''); // 検索クエリの状態を追加

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data...'); // デバッグログ

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

        const { youtube_video_likes, note_likes, youtube_playlist_url, avatar_url } = response.data;
        setYoutubeVideoLikes(youtube_video_likes);
        setNoteLikes(note_likes);
        setYoutubePlaylistUrl(youtube_playlist_url);

        // currentUserにavatar_urlを追加
        if (currentUser) {
          (currentUser as CustomUser).avatar_url = avatar_url;
        }

        // ノートのデータをログに出力して確認
        console.log('Fetched Note Likes:', note_likes);
      } catch (error) {
        console.error('Error fetching mypage data:', error);
      }
    };

    fetchData();
  }, [jwtToken, currentUser]);

  // YouTube動画を取得する関数を追加
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
              {(currentUser as CustomUser).avatar_url && (
                <img
                  src={(currentUser as CustomUser).avatar_url}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full mr-4"
                />
              )}
            </li>
            <li className="nav-item mb-3">
              Name
              {currentUser.name}
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
          <form onSubmit={handleSearch} className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ジャンル or キーワードで動画を取得"
              className="input input-bordered input-lg"
            />
            <button type="submit" className="btn btn-outline">取得</button>
          </form>

          {youtubeVideos.length > 0 && (
            <div className="mb-4">
              <h1 className="text-xl font-bold mb-4">取得したYouTube動画</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {youtubeVideos.map((video, index) => (
                  <div key={video.id} className="col-span-1">
                    <div className="card bg-base-100 shadow-xl mb-3">
                      <div className="card-body">
                        <h2 className="card-title">{video.title}</h2>
                        <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
                        <p>動画時間: {video.duration}秒</p>
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtube_id}`}
                          frameBorder="0"
                          allowFullScreen
                          className="w-full aspect-video"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              {noteLikes.map((like, index) => {
                if (like.likeable && isNote(like.likeable)) {
                  const note = like.likeable;
                  console.log('Rendering Note:', note); // デバッグログ
                  return (
                    <div key={note.id} className="col-span-1">
                      <div className="card bg-base-100 shadow-xl mb-3">
                        <div className="card-body">
                          {note.user && (
                            <>
                              {note.user.avatar_url && (
                                <img
                                  src={note.user.avatar_url}
                                  alt="User Avatar"
                                  className="w-16 h-16 rounded-full mr-4"
                                />
                              )}
                              <p>
                                <span className="font-bold">ユーザー名:</span> {note.user.name}
                              </p>
                            </>
                          )}
                          <p>メモ内容：{note.content}</p>
                          <p>いいね数：{note.likes_count}</p>
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

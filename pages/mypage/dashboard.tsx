import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { useAuth } from '../../context/AuthContext';
import { Like } from '../../types/like';
import { Note } from '../../types/note';
import { CustomUser } from '../../types/user';
import axios from 'axios';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoadingSpinner from '../../components/LoadingSpinner';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { useFlashMessage } from '../../context/FlashMessageContext'; // フラッシュメッセージ用フックをインポート

function isNote(likeable: any): likeable is Note {
  return likeable !== undefined && (likeable as Note).content !== undefined;
}

const Dashboard = () => {
  const { currentUser, jwtToken, loading, setAuthState } = useAuth();
  const { setFlashMessage } = useFlashMessage(); // フラッシュメッセージ用のフックを使用
  const router = useRouter();
  const [youtubeVideoLikes, setYoutubeVideoLikes] = useState<Like[]>([]);
  const [noteLikes, setNoteLikes] = useState<Like[]>([]);
  const [youtubePlaylistUrl, setYoutubePlaylistUrl] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMessageDisplayed, setIsMessageDisplayed] = useState(false); // フラグを追加

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

        // フラッシュメッセージが表示されたかどうかをlocalStorageで確認
        const messageDisplayed = localStorage.getItem('isMessageDisplayed') === 'true';

        if (!messageDisplayed) {
          setFlashMessage('ログインに成功しました'); // フラッシュメッセージを設定
          localStorage.setItem('isMessageDisplayed', 'true'); // フラグを更新
        }

        console.log('Updated currentUser:', currentUser);
        console.log('Fetched Note Likes:', note_likes);
      } catch (error) {
        setFlashMessage('ログインに失敗しました'); // エラーメッセージを設定
        console.error('Error fetching mypage data:', error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwtToken]);


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
    return <LoadingSpinner loading={loading} />;
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
          <Card>
            <CardContent>
              <div className="flex items-center mb-4">
                {currentUser.avatar_url && (
                  <Avatar src={currentUser.avatar_url} alt="Avatar" sx={{ width: 64, height: 64, mr: 2 }} />
                )}
                <div className="text-container">
                  <Typography variant="h6" className="text-wrap">{currentUser.name}</Typography>
                  <Typography variant="body2" color="textSecondary" className="text-wrap">{currentUser.email}</Typography>
                </div>
              </div>
              <Link href="/mypage/edit" legacyBehavior>
                <Button variant="contained" color="primary" fullWidth>ユーザー編集</Button>
              </Link>
              {isAdmin && (
                <Link href={`${process.env.NEXT_PUBLIC_API_URL}/admin/users`} legacyBehavior>
                  <Button variant="contained" color="secondary" fullWidth className="mt-4">会員一覧</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:flex-1 md:pl-8">
          {currentUser.role === 'admin' && (
            <Card className="mb-8">
              <CardContent>
                <form onSubmit={handleSearch}>
                  <Box display="flex" alignItems="center">
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
              </CardContent>
            </Card>
          )}

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">「いいね」した動画プレイリスト</Typography>
            </AccordionSummary>
            <AccordionDetails>
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
                <Typography variant="body2" color="textSecondary">いいねした動画がありません。</Typography>
              )}
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">最新「いいね」したメモ一覧</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {noteLikes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {noteLikes.map((like, index) => {
                    if (like.likeable && isNote(like.likeable)) {
                      const note = like.likeable;
                      console.log('Rendering Note:', note);
                      return (
                        <Card key={note.id} className="col-span-1 custom-card-size">
                          <CardContent className="custom-card-content">
                            {note.user && (
                              <div className="flex items-center mb-4">
                                {note.user.avatar_url && (
                                  <Avatar src={note.user.avatar_url} alt="User Avatar" sx={{ width: 32, height: 32, mr: 2 }} />
                                )}
                                <div>
                                  <Typography variant="body2" className="font-bold">{note.user.name}</Typography>
                                </div>
                              </div>
                            )}
                            <Typography variant="body2" color="textPrimary" className="mb-2 note-content">メモ内容：{note.content}</Typography>
                            <Typography variant="body2" color="textSecondary">いいね数：{note.likes_count}</Typography>
                            {note.youtube_video_id && (
                              <Box mt={2}>
                                <Link href={`/youtube_videos/${note.youtube_video_id}`} legacyBehavior>
                                  <Button variant="contained" color="primary" size="small">この動画を見る</Button>
                                </Link>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      );
                    }
                    return null;
                  })}
                </div>
              ) : (
                <Typography variant="body2" color="textSecondary">いいねしたメモがありません。</Typography>
              )}
            </AccordionDetails>
          </Accordion>
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
        .custom-card-size {
          height: 250px; /* 固定サイズを設定 */
          overflow: hidden; /* オーバーフローを隠す */
        }
        .custom-card-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .note-content {
          white-space: pre-wrap; /* 改行を反映 */
          overflow-y: auto; /* コンテンツがカードを超えた場合のスクロールを許可 */
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

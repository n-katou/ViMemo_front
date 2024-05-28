import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Like } from '../../types/like';
import { Note } from '../../types/note';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { FaTrashAlt } from 'react-icons/fa';
import Link from 'next/link';
import Pagination from '../../components/Pagination';

export const fetchNoteLikes = async (
  jwtToken: string,
  setNoteLikes: (data: Like[]) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  setError(null);

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mypage`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    console.log('API response:', response.data); // レスポンスデータをログに出力

    if (!response.data.note_likes) {
      throw new Error('Failed to fetch note likes');
    }

    setNoteLikes(response.data.note_likes);
  } catch (error) {
    console.error('Error fetching note likes:', error);
    setError('メモのいいねの取得に失敗しました。');
  } finally {
    setLoading(false);
  }
};

const isNote = (likeable: any): likeable is Note => {
  return (likeable as Note).content !== undefined;
};

const FavoriteNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const [noteLikes, setNoteLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (!currentUser || !jwtToken) {
      console.log("Current user or JWT token is missing.");
      setLoading(false);
      return;
    }

    console.log("Fetching note likes for user:", currentUser);

    fetchNoteLikes(jwtToken, setNoteLikes, setError, setLoading)
      .then(() => {
        console.log("Note likes fetched successfully");
      })
      .catch((err) => {
        console.error("Error fetching note likes:", err);
      });
  }, [currentUser, jwtToken]);

  if (loading) {
    console.log("Loading state: ", loading);
    return <LoadingSpinner loading={loading} />;
  }
  if (error) {
    console.error("Error state: ", error);
    return <p>{error}</p>;
  }

  console.log("Note likes: ", noteLikes);

  // ページネーションのためのアイテムのスライス
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = noteLikes.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">いいねしたメモ一覧</h1>
      {currentItems.length > 0 ? (
        <>
          <Grid container spacing={4}>
            {currentItems.map((like) => {
              const note = like.likeable;
              if (isNote(note)) {
                return (
                  <Grid item xs={12} sm={6} md={4} key={like.id}>
                    <Card className="note-card">
                      <CardContent className="note-card-content">
                        {note.user && (
                          <div className="flex items-center mb-2">
                            {note.user.avatar_url && (
                              <Avatar src={note.user.avatar_url} alt="User Avatar" sx={{ width: 32, height: 32, mr: 2 }} />
                            )}
                            <Typography variant="body2" className="font-bold">{note.user.name}</Typography>
                          </div>
                        )}
                        <Typography variant="subtitle1" color="textPrimary" className="note-card-title">
                          {note.youtube_video_title || 'タイトルを取得できませんでした'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="note-content">
                          {note.content}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className="note-card-likes">
                          いいね数: {note.likes_count}
                        </Typography>
                        {note.youtube_video_id && (
                          <Box className="fixed-button-container">
                            <Link href={`/youtube_videos/${note.youtube_video_id}`} passHref legacyBehavior>
                              <Button variant="contained" className="btn btn-outline btn-darkpink" size="small">
                                この動画を見る
                              </Button>
                            </Link>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(noteLikes.length / itemsPerPage)}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </Box>
        </>
      ) : (
        <p>いいねしたメモがありません。</p>
      )}
    </div>
  );
};

export default FavoriteNotesPage;

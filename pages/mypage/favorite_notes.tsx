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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">いいねしたメモ一覧</h1>
      {noteLikes.length > 0 ? (
        <Grid container spacing={4}>
          {noteLikes.map((like) => {
            const note = like.likeable;
            if (isNote(note)) {
              return (
                <Grid item xs={12} sm={6} md={4} key={like.id}>
                  <Card>
                    <CardContent>
                      {note.user && (
                        <div className="flex items-center mb-2">
                          {note.user.avatar_url && (
                            <Avatar src={note.user.avatar_url} alt="User Avatar" sx={{ width: 32, height: 32, mr: 2 }} />
                          )}
                          <Typography variant="body2" className="font-bold">{note.user.name}</Typography>
                        </div>
                      )}
                      <Typography variant="subtitle1" color="textPrimary" className="mb-1">
                        {note.youtube_video_title || 'タイトルを取得できませんでした'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="flex-grow overflow-auto mb-2">
                        {note.content}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" className="mb-2">
                        いいね数: {note.likes_count}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            }
            return null;
          })}
        </Grid>
      ) : (
        <p>いいねしたメモがありません。</p>
      )}
    </div>
  );
};

export default FavoriteNotesPage;

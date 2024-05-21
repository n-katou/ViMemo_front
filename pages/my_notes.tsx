import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Note } from '../types/note'; // Noteインターフェースをインポート
import Link from 'next/link';

interface NoteWithVideoTitle extends Note {
  video_title?: string;
}

const MyNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const [notes, setNotes] = useState<NoteWithVideoTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      console.log("Current user is missing.");
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        const userNotesUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notes?filter=my_notes`;
        console.log(`Request URL for user notes: ${userNotesUrl}`);

        const res = await axios.get(userNotesUrl, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        console.log('User notes API response:', res);

        if (res.data) {
          const notesWithTitles = await Promise.all(res.data.map(async (note: Note) => {
            const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${note.youtube_video_id}`;
            const videoRes = await axios.get(videoUrl, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            });
            console.log('Video API response:', videoRes); // 追加: 動画APIのレスポンスをログに出力
            return {
              ...note,
              video_title: videoRes.data.title,
            };
          }));
          setNotes(notesWithTitles);
        } else {
          console.error('No data returned from API');
          setError('メモの取得に失敗しました。');
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('メモの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [currentUser, jwtToken]);

  if (loading) return <LoadingSpinner loading={loading} />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">自分のメモ</h1>
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white shadow-lg rounded-lg p-6">
              <p className="text-gray-800 font-semibold mb-2">{note.video_title}</p>
              <p className="text-gray-600 mb-2">{note.content}</p>
              <p className="text-gray-600 mb-4">{note.video_timestamp}</p>
              <Link href={`/youtube_videos/${note.youtube_video_id}`} legacyBehavior>
                <a className="text-blue-500 hover:underline">
                  YouTube動画を見る
                </a>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>メモがありません。</p>
      )}
    </div>
  );
};

export default MyNotesPage;

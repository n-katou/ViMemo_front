import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Note } from '../types/note'; // Noteインターフェースをインポート

const MyNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
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
          setNotes(res.data);
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

  const uniqueVideoIds = Array.from(new Set(notes.map(note => note.youtube_video_id)));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">自分のメモ</h1>
      {notes.length > 0 ? (
        notes.map((note) => (
          <div key={note.id} className="bg-white shadow-lg rounded-lg p-4 mb-4">
            <p className="text-gray-600">{note.content}</p>
            <p className="text-gray-600">{note.video_timestamp}</p>
            <p className="text-gray-600">Video ID: {note.youtube_video_id}</p>
          </div>
        ))
      ) : (
        <p>メモがありません。</p>
      )}
    </div>
  );
};

export default MyNotesPage;

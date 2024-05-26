import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoteCard from '../../components/Note/NoteCard';
import { Note } from '../../types/note';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import PaginationComponent from '../../components/Pagination';  // 共通コンポーネントをインポート

interface NoteWithVideoTitle extends Note {
  video_title?: string;
}

const MyNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const [notes, setNotes] = useState<NoteWithVideoTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!currentUser) {
      console.log("Current user is missing.");
      setLoading(false);
      return;
    }

    const fetchNotes = async (page: number) => {
      try {
        const userNotesUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notes?filter=my_notes&page=${page}`;
        console.log(`Request URL for user notes: ${userNotesUrl}`);

        const res = await axios.get(userNotesUrl, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        console.log('User notes API response:', res);

        if (res.data.notes) {
          const notesWithTitles = await Promise.all(res.data.notes.map(async (note: Note) => {
            const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${note.youtube_video_id}`;
            const videoRes = await axios.get(videoUrl, {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            });
            console.log('Video API response:', videoRes);
            return {
              ...note,
              video_title: videoRes.data.youtube_video.title,
            };
          }));
          setNotes(notesWithTitles);
          setTotalPages(res.data.total_pages);
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

    fetchNotes(page);
  }, [currentUser, jwtToken, page]);

  const handleDeleteNote = async (noteId: number) => {
    try {
      const deleteUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notes/${noteId}`;
      await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const sortedNotes = notes.sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    } else {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const toggleSortOrder = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setLoading(true);
    }
  };

  if (loading) return <LoadingSpinner loading={loading} />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">自分のメモ</h1>
        <button
          onClick={toggleSortOrder}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
          {sortOrder === 'asc' ? '古い順' : '新しい順'}
        </button>
      </div>
      {sortedNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedNotes.map((note) => (
            <NoteCard
              key={note.id}
              videoTitle={note.video_title || 'タイトルなし'}
              content={note.content}
              videoTimestamp={note.video_timestamp}
              youtubeVideoId={note.youtube_video_id}
              createdAt={note.created_at}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))}
        </div>
      ) : (
        <p>メモがありません。</p>
      )}
      <PaginationComponent
        count={totalPages}
        page={page}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default MyNotesPage;

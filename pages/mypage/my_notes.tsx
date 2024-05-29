import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoteCard from '../../components/MyNote/NoteCard';
import { Note } from '../../types/note';
import PaginationComponent from '../../components/Pagination';

interface NoteWithVideoTitle extends Note {
  video_title: string;
}

const MyNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const [notes, setNotes] = useState<NoteWithVideoTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('created_at_desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchNotes = async (page: number, sort: string) => {
      try {
        const userNotesUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/notes_with_videos?page=${page}&sort=${sort}`;
        const res = await axios.get(userNotesUrl, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (res.data.notes) {
          setNotes(res.data.notes);
          setTotalPages(res.data.total_pages);
        } else {
          setError('メモの取得に失敗しました。');
        }
      } catch (err) {
        setError('メモの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes(page, sortOption);
  }, [currentUser, jwtToken, page, sortOption]);

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

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(event.target.value);
    setPage(1);
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white-900">MYメモ一覧</h1>
      <div className="flex justify-end mb-8">
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="form-select form-select-lg text-white bg-gray-800 border-gray-600 rounded-md"
        >
          <option value="created_at_desc">デフォルト（新しい順）</option>
          <option value="created_at_asc">古い順</option>
        </select>
      </div>
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              videoTitle={note.video_title}
              content={note.content}
              videoTimestamp={note.video_timestamp}
              youtubeVideoId={note.youtube_video_id}
              createdAt={note.created_at}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">メモがありません。</p>
      )}
      <div className="mt-8">
        <PaginationComponent
          count={totalPages}
          page={page}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default MyNotesPage;

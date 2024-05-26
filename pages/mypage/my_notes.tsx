import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoteCard from '../../components/Note/NoteCard';
import { Note } from '../../types/note';
import PaginationComponent from '../../components/Pagination';  // 共通コンポーネントをインポート

interface NoteWithVideoTitle extends Note {
  video_title?: string;
}

const MyNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const [notes, setNotes] = useState<NoteWithVideoTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('created_at_desc');  // ソートオプションを追加
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!currentUser) {
      console.log("Current user is missing.");
      setLoading(false);
      return;
    }

    const fetchNotes = async (page: number, sort: string) => {
      try {
        const userNotesUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notes?filter=my_notes&page=${page}&sort=${sort}`;
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

    fetchNotes(page, sortOption);
  }, [currentUser, jwtToken, page, sortOption]);  // sortOptionを依存配列に追加

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
    setPage(1);  // ソートオプションが変更された場合、ページをリセット
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
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="form-select form-select-lg text-white bg-gray-800 border-gray-600"
        >
          <option value="created_at_desc">デフォルト（新しい順）</option>
          <option value="created_at_asc">古い順</option>
        </select>
      </div>
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
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

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoteCard from '../../components/Mypage/my_notes/NoteCard';
import { NoteWithVideoTitle } from '../../types/note'; // 必要に応じてインポートパスを調整
import PaginationComponent from '../../components/Pagination';
import Accordion from '../../components/Mypage/my_notes/Accordion'; // 追加
import { groupNotesByVideoId } from '../../utils/groupNotesByVideoId'; // 追加

const ITEMS_PER_PAGE = 10;

const MyNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<NoteWithVideoTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('created_at_desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchNotes = async (sort: string) => {
      try {
        const userNotesUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/notes_with_videos?sort=${sort}`;
        const res = await axios.get(userNotesUrl, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (res.data.notes) {
          setNotes(res.data.notes);
        } else {
          setError('メモの取得に失敗しました。');
        }
      } catch (err) {
        setError('メモの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    const querySort = router.query.sort as string || 'created_at_desc';
    setSortOption(querySort);
    fetchNotes(querySort);
  }, [currentUser, jwtToken, router.query.sort]);

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

  const handlePageChange = (_event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    }, undefined, { shallow: true });
  };

  const filteredNotes = notes.filter(note =>
    note.video_title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingSpinner loading={loading} />;
  if (error) return <p>{error}</p>;

  const groupedNotes = groupNotesByVideoId(filteredNotes);
  const videoIds = Object.keys(groupedNotes);
  const paginatedVideoIds = videoIds.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(videoIds.length / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-white-900 mb-4">MYメモ一覧</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="YouTubeタイトルで検索"
        className="mb-4 p-2 border rounded-md w-full"
      />
      {paginatedVideoIds.length > 0 ? (
        paginatedVideoIds.map((videoId) => (
          <Accordion key={videoId} title={groupedNotes[Number(videoId)].video_title}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedNotes[Number(videoId)].notes.map((note: NoteWithVideoTitle) => (
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
          </Accordion>
        ))
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

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import NoteCard from '../../components/Mypage/my_notes/NoteCard';
import { NoteWithVideoTitle } from '../../types/note';
import PaginationComponent from '../../components/Pagination';
import Accordion from '../../components/Mypage/my_notes/Accordion';
import { groupNotesByVideoId } from '../../utils/groupNotesByVideoId';
import { useTheme } from 'next-themes';
import useFetchNotes from '../../hooks/mypage/my_notes/useFetchNotes';
import useHandleDeleteNote from '../../hooks/mypage/my_notes/useHandleDeleteNote';

const ITEMS_PER_PAGE = 10;

const MyNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const { theme } = useTheme();
  const { notes, loading, error, setNotes } = useFetchNotes({ jwtToken, currentUser });
  const handleDeleteNote = useHandleDeleteNote(jwtToken, setNotes);

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);

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
    <div className={`container mx-auto py-8 px-4 mt-4 max-w-screen-lg ${theme === 'light' ? 'text-[#818cf8]' : 'text-white'}`}>
      <h1 className="text-3xl font-bold mb-4">MYメモ一覧</h1>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="YouTubeタイトルで検索"
        className={`mb-4 p-2 border rounded-md w-full ${theme === 'light' ? 'border-gray-400' : 'border-gray-600'}`}
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
                  noteId={note.id}
                  createdAt={note.created_at}
                  onDelete={() => handleDeleteNote(note.youtube_video_id, note.id)}
                />
              ))}
            </div>
          </Accordion>
        ))
      ) : (
        <p className={`text-lg ${theme === 'light' ? 'text-[#818cf8]' : 'text-white'}`}>メモがありません。</p>
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

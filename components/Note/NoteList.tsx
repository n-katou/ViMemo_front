import React, { useEffect, useState } from 'react';
import NoteItem from './NoteItem';
import { Note } from '../../types/note';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Navigation } from 'swiper/modules'; // 修正: 適切なモジュールをインポート

interface NoteListProps {
  notes: Note[];
  currentUser: any;
  videoTimestampToSeconds: (timestamp: string) => number;
  playFromTimestamp: (seconds: number) => void;
  videoId: number;
  onDelete: (noteId: number) => void;
  onEdit: (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => void;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  currentUser,
  videoTimestampToSeconds,
  playFromTimestamp,
  videoId,
  onDelete,
  onEdit,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div id="notes_list" className="mt-5">
      <h2 className="text-xl font-bold mb-4">メモ一覧</h2>
      {notes.length > 0 ? (
        isMobile ? (
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            modules={[Pagination, Navigation]} // 修正: 適切なモジュールを指定
          >
            {notes.map((note) => {
              const isOwner = currentUser?.id === note.user?.id;
              return (
                <SwiperSlide key={note.id}>
                  <NoteItem
                    note={note}
                    currentUser={currentUser}
                    videoTimestampToSeconds={videoTimestampToSeconds}
                    playFromTimestamp={playFromTimestamp}
                    videoId={videoId}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    isOwner={isOwner}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <div className="flex flex-wrap -mx-2">
            {notes.map((note) => {
              const isOwner = currentUser?.id === note.user?.id;
              return (
                <div key={note.id} className="p-2 w-full sm:w-1/2 lg:w-1/3">
                  <NoteItem
                    note={note}
                    currentUser={currentUser}
                    videoTimestampToSeconds={videoTimestampToSeconds}
                    playFromTimestamp={playFromTimestamp}
                    videoId={videoId}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    isOwner={isOwner}
                  />
                </div>
              );
            })}
          </div>
        )
      ) : (
        <p id="no_notes_message">メモがありません。</p>
      )}
    </div>
  );
};

export default NoteList;

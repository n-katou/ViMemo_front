import React from 'react';
import YoutubeVideoCard from './YoutubeVideoCard';
import PaginationComponent from '../Pagination';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';

interface Props {
  youtubeVideos: YoutubeVideo[];
  notes: Note[];
  jwtToken: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  scrollByBlock: (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement>) => void;
  handleTitleClick: (id: number) => void;
  handleLikeVideo: (id: number) => Promise<void>;
  handleUnlikeVideo: (id: number, likeId: number) => Promise<void>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  pagination: { total_pages: number; current_page: number };
  handlePageChange: (event: any, value: number) => void;
}

const VideoHorizontalScroll: React.FC<Props> = ({
  youtubeVideos,
  notes,
  jwtToken,
  scrollContainerRef,
  scrollByBlock,
  handleTitleClick,
  handleLikeVideo,
  handleUnlikeVideo,
  setNotes,
  pagination,
  handlePageChange
}) => (
  <div className="relative w-full pb-4 overflow-visible">
    <button
      onClick={() => scrollByBlock('left', scrollContainerRef)}
      className="absolute z-50 -left-4 top-[90px] bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full transition-transform duration-300 hover:scale-110"
    >
      ◀
    </button>

    <div className="relative w-full pb-4 overflow-visible z-10">
      <div className="mx-8 overflow-visible">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 scroll-smooth scrollbar-hide snap-x snap-mandatory overflow-visible relative z-10"
        >
          {youtubeVideos.map((video) => (
            <div
              key={video.id}
              className="relative flex-shrink-0 w-80 snap-start overflow-visible z-10"
            >
              <YoutubeVideoCard
                video={video}
                handleTitleClick={handleTitleClick}
                handleLikeVideo={handleLikeVideo}
                handleUnlikeVideo={handleUnlikeVideo}
                notes={notes.filter(note => note.youtube_video_id === video.id)}
                jwtToken={jwtToken}
                setNotes={setNotes}
              />
            </div>
          ))}
        </div>
      </div>
    </div>

    <button
      onClick={() => scrollByBlock('right', scrollContainerRef)}
      className="absolute z-50 -right-4 top-[90px] bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full transition-transform duration-300 hover:scale-110"
    >
      ▶
    </button>

    <div className="mt-6 mb-3 flex justify-center">
      <PaginationComponent
        count={pagination.total_pages}
        page={pagination.current_page}
        onChange={handlePageChange}
      />
    </div>
  </div>
);

export default VideoHorizontalScroll;

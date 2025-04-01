import React from 'react';
import YoutubeVideoCard from './YoutubeVideoCard';
import PaginationComponent from '../Pagination';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';

interface Props {
  youtubeVideos: YoutubeVideo[];
  notes: Note[];
  jwtToken: string | null;
  handleTitleClick: (id: number) => void;
  handleLikeVideo: (id: number) => Promise<void>;
  handleUnlikeVideo: (id: number, likeId: number) => Promise<void>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  pagination: {
    total_pages: number;
    current_page: number;
  };
  handlePageChange: (event: any, value: number) => void;
}

const VideoGrid: React.FC<Props> = ({
  youtubeVideos,
  notes,
  jwtToken,
  handleTitleClick,
  handleLikeVideo,
  handleUnlikeVideo,
  setNotes,
  pagination,
  handlePageChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 py-12">
      {youtubeVideos.map((video) => (
        <div key={video.id} className="w-full">
          <YoutubeVideoCard
            video={video}
            handleTitleClick={handleTitleClick}
            handleLikeVideo={handleLikeVideo}
            handleUnlikeVideo={handleUnlikeVideo}
            notes={notes.filter((note) => note.youtube_video_id === video.id)}
            jwtToken={jwtToken}
            setNotes={setNotes}
          />
        </div>
      ))}
      <div className="col-span-full mt-6 flex justify-center">
        <PaginationComponent
          count={pagination.total_pages}
          page={pagination.current_page}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default VideoGrid;

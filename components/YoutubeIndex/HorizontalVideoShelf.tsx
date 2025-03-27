import React, { useRef } from 'react';
import { YoutubeVideo } from '@/types/youtubeVideo';
import YoutubeVideoCard from '@/components/YoutubeIndex/YoutubeVideoCard';
import { Note } from '@/types/note';

export type HorizontalVideoShelfProps = {
  title: string;
  videos: YoutubeVideo[];
  notes: Note[];
  jwtToken: string | null;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  onClickTitle: (id: number) => void;
  onLike: (id: number) => Promise<void>;
  onUnlike: (id: number, likeId: number) => Promise<void>;
};

const HorizontalVideoShelf: React.FC<HorizontalVideoShelfProps> = ({
  title,
  videos,
  notes,
  jwtToken,
  setNotes,
  onClickTitle,
  onLike,
  onUnlike,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByBlock = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = 320;
    const gap = 16;
    const itemTotalWidth = cardWidth + gap;

    const currentScroll = container.scrollLeft;
    const currentIndex = Math.round(currentScroll / itemTotalWidth);
    const nextIndex = direction === 'left'
      ? Math.max(0, currentIndex - 3)
      : Math.min(Math.ceil(container.scrollWidth / itemTotalWidth), currentIndex + 3);

    container.scrollTo({
      left: nextIndex * itemTotalWidth,
      behavior: 'smooth',
    });
  };

  return (
    <div className="container mx-auto px-4 mb-12">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <div className="relative">
        <button
          onClick={() => scrollByBlock('left')}
          className="absolute -left-16 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full z-20 transition-transform duration-300 hover:scale-110"
        >
          ◀
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 px-10 scroll-smooth scrollbar-hide snap-x snap-mandatory"
        >
          {videos.map((video) => (
            <div key={video.id} className="flex-shrink-0 w-80 snap-start">
              <YoutubeVideoCard
                video={video}
                handleTitleClick={() => onClickTitle(video.id)}
                handleLikeVideo={() => onLike(video.id)}
                handleUnlikeVideo={(likeId) => onUnlike(video.id, likeId)}
                notes={notes.filter(note => note.youtube_video_id === video.id)}
                jwtToken={jwtToken}
                setNotes={setNotes}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollByBlock('right')}
          className="absolute -right-16 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-3 rounded-full z-20 transition-transform duration-300 hover:scale-110"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default HorizontalVideoShelf;

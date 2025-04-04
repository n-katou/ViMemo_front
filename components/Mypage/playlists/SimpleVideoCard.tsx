import React from 'react';
import { useRouter } from 'next/router';
import { useDrag, useDrop } from 'react-dnd';
import { YoutubeVideo } from '../../../types/youtubeVideo';
import { MdDragIndicator } from 'react-icons/md';

type DragItem = {
  index: number;
  type: string;
};

interface Props {
  video: YoutubeVideo;
  index: number;
  moveVideo: (dragIndex: number, hoverIndex: number) => void;
  className?: string;
}

const SimpleVideoCard: React.FC<Props> = ({ video, index, moveVideo, className }) => {
  const router = useRouter();
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ handlerId, isOver }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null; isOver: boolean }>({
    accept: 'video',
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
      isOver: monitor.isOver(),
    }),
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveVideo(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: 'video',
    item: { index, type: 'video' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;

  const cardStyle = {
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isDragging
      ? '#38bdf8' // 水色
      : isOver
        ? '#22eec5' // 緑
        : 'white',
  };

  return (
    <div
      ref={ref}
      data-handler-id={handlerId ?? undefined}
      className={`relative border border-gray-200 rounded-md shadow-sm bg-white cursor-move ${className}`}
      style={cardStyle}
    >
      <div className="w-full h-5 bg-gradient-rainbow flex items-center justify-center">
        <MdDragIndicator className="text-white" size={14} />
      </div>

      <img
        src={thumbnailUrl}
        alt={video.title}
        className="w-full h-40 object-cover"
      />

      <div className="p-2">
        <h2
          className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer truncate"
          onClick={() => router.push(`/youtube_videos/${video.id}`)}
          title={video.title}
        >
          {video.title}
        </h2>
      </div>
    </div>
  );
};

export default SimpleVideoCard;

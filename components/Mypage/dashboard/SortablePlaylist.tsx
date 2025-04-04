import React, { useState } from 'react';
import Button from '@mui/material/Button';
import useDragDropVideoCard from '../../../hooks/mypage/favorite_videos/useDragDropVideoCard';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../../../types/youtubeVideo';

interface PlaylistItem {
  id: number;
  position: number;
  youtube_video: YoutubeVideo;
}

// プレイリストの1つのアイテムコンポーネント
interface PlaylistItemProps {
  item: PlaylistItem;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
}

const PlaylistItemComponent: React.FC<PlaylistItemProps> = ({ item, index, moveItem }) => {
  const { dragDropRef, isDragging, isOver } = useDragDropVideoCard(index, moveItem);

  const backgroundColor = isDragging ? '#38bdf8' : isOver ? '#22eec5' : 'white';
  const opacity = isDragging ? 0.5 : 1;

  const thumbnailUrl = item.youtube_video.youtube_id
    ? `https://img.youtube.com/vi/${item.youtube_video.youtube_id}/hqdefault.jpg`
    : '/default-thumbnail.jpg';

  const router = useRouter();

  const handleClick = () => {
    router.push(`/youtube_videos/${item.youtube_video.id}`);
  };


  return (
    <div
      ref={dragDropRef}
      className="mb-4"
      style={{
        opacity,
        backgroundColor,
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'background-color 0.3s ease',
        color: 'black',
        cursor: 'pointer',
        flexBasis: 'calc(50% - 16px)',
        minHeight: '60px',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span style={{ fontWeight: 'bold' }}>{index + 1}.</span>
      <img
        src={thumbnailUrl}
        alt={`thumbnail-${item.youtube_video.id}`}
        style={{
          width: '64px',
          height: '36px',
          borderRadius: '4px',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      {item.youtube_video.title ? (
        <button
          onClick={handleClick}
          className="text-blue-600 font-bold hover:underline hover:text-blue-800 transition duration-200 ease-in-out max-w-full text-left whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {item.youtube_video.title}
        </button>
      ) : (
        <span>不明な動画 (ID: {item.youtube_video.id})</span>
      )}
    </div>
  );
};

// 並び替え可能なプレイリスト
interface SortablePlaylistProps {
  playlistItems: PlaylistItem[];
  moveItem: (fromIndex: number, toIndex: number) => void;
}

const SortablePlaylist: React.FC<SortablePlaylistProps> = ({ playlistItems, moveItem }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false); // 展開状態管理
  const maxVisibleItems = 5; // 最初に表示するアイテム数

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <h2 style={{ color: theme === 'light' ? '#818cf8' : '#000', marginBottom: '12px' }}>
        作成したプレイリスト（並び替え可能）
      </h2>

      <div style={{ height: '390px', overflowY: 'auto', position: 'relative' }}>
        {playlistItems
          .slice(0, isExpanded ? playlistItems.length : maxVisibleItems)
          .map((item, index) => (
            <PlaylistItemComponent
              key={item.id}
              item={item}
              index={index}
              moveItem={moveItem}
            />
          ))}
      </div>

      {isExpanded && (
        <p style={{ fontSize: '12px', textAlign: 'center', color: '#888', marginTop: '4px' }}>
          下にスクロールできます
        </p>
      )}
      {playlistItems.length > maxVisibleItems && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            onClick={handleToggleExpand}
            sx={{
              backgroundColor: '#22eec5',
              color: 'white',
              width: '35%',
              '&:hover': {
                backgroundColor: '#1bb89a', // ホバー時の色を少し濃くする
              },
            }}
          >
            {isExpanded ? '閉じる' : 'もっと見る'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SortablePlaylist;

import React, { useState } from 'react';
import Button from '@mui/material/Button';
import useDragDropVideoCard from '../../../hooks/mypage/favorite_videos/useDragDropVideoCard';
import { useTheme } from 'next-themes';

// 動画のLike型を定義
interface Like {
  likeable_id: number;
  youtube_id?: string;
  title: string | null;
}

// プレイリストの1つのアイテムコンポーネント
interface PlaylistItemProps {
  like: Like;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ like, index, moveItem }) => {
  const { dragDropRef, isDragging, isOver } = useDragDropVideoCard(index, moveItem);

  const backgroundColor = isDragging ? '#38bdf8' : isOver ? '#22eec5' : 'white';
  const opacity = isDragging ? 0.5 : 1;

  const thumbnailUrl = `https://img.youtube.com/vi/${like.youtube_id}/hqdefault.jpg`;

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
        alt={`thumbnail-${like.likeable_id}`}
        style={{
          width: '64px',
          height: '36px',
          borderRadius: '4px',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
      {like.title ? (
        <span
          style={{
            display: 'inline-block',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {like.title}
        </span>
      ) : (
        <span>不明な動画 (ID: {like.likeable_id})</span>
      )}
    </div>
  );
};

// 並び替え可能なプレイリスト
interface SortablePlaylistProps {
  youtubeVideoLikes: Like[];
  moveItem: (fromIndex: number, toIndex: number) => void;
}

const SortablePlaylist: React.FC<SortablePlaylistProps> = ({ youtubeVideoLikes, moveItem }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false); // 展開状態管理
  const maxVisibleItems = 3; // 最初に表示するアイテム数

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <h2 style={{ color: theme === 'light' ? '#818cf8' : '#000', marginBottom: '12px' }}>
        再生中のプレイリスト（ドラッグ&ドロップで並び替え可能）
      </h2>

      <div>
        {youtubeVideoLikes
          .slice(0, isExpanded ? youtubeVideoLikes.length : maxVisibleItems)
          .map((like, index) => (
            <PlaylistItem
              key={like.likeable_id}
              like={like}
              index={index}
              moveItem={moveItem}
            />
          ))}
      </div>

      {youtubeVideoLikes.length > maxVisibleItems && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
          <Button
            variant="contained"
            onClick={handleToggleExpand}
            sx={{
              backgroundColor: '#22eec5',
              color: 'white',
              width: '30%',
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

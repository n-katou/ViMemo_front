import React, { useState } from 'react';
import Button from '@mui/material/Button';
import useDragDropVideoCard from '../../../hooks/mypage/favorite_videos/useDragDropVideoCard';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { PlaylistItem } from '../../../types/playlistItem';
import { handleRemoveItem } from "@/components/Mypage/playlists/playlistUtils";
import { formatDuration } from '../../../components/YoutubeShow/youtubeShowUtils';

interface PlaylistItemProps {
  item: PlaylistItem;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
  onRemove?: (id: number) => void;
}

const PlaylistItemComponent: React.FC<PlaylistItemProps> = ({ item, index, moveItem, onRemove }) => {
  const { dragDropRef, isDragging, isOver } = useDragDropVideoCard(index, moveItem);
  const router = useRouter();

  const backgroundColor = isDragging ? '#38bdf8' : isOver ? '#22eec5' : 'white';
  const opacity = isDragging ? 0.5 : 1;

  const thumbnailUrl = item.youtube_video.youtube_id
    ? `https://img.youtube.com/vi/${item.youtube_video.youtube_id}/hqdefault.jpg`
    : '/default-thumbnail.jpg';

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
        flexDirection: 'column', // ← 上下方向に配置
        gap: '6px',
      }}
    >
      <div className="flex items-center gap-3 w-full">
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
            onClick={() => router.push(`/youtube_videos/${item.youtube_video.id}`)}
            className="text-blue-600 font-bold hover:underline hover:text-blue-800 transition duration-200 ease-in-out text-left flex-1 truncate"
            title={item.youtube_video.title}
          >
            {item.youtube_video.title}
          </button>
        ) : (
          <span>不明な動画 (ID: {item.youtube_video.id})</span>
        )}
      </div>

      {/* 削除ボタンを独立して下に配置 */}
      {onRemove && (
        <div className="flex justify-end w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(item.id);
            }}
            className="text-sm text-red-500 border border-red-500 rounded px-3 py-1 transition duration-200 ease-in-out hover:bg-red-500 hover:text-white"
            title="プレイリストから削除"
          >
            削除
          </button>
        </div>
      )}
    </div>

  );
};

// ✅ props 修正
interface SortablePlaylistProps {
  playlistItems: PlaylistItem[];
  setPlaylistItems: (items: PlaylistItem[]) => void;
  playlistId: number;
  jwtToken: string;
}

const SortablePlaylist: React.FC<SortablePlaylistProps> = ({ playlistItems, setPlaylistItems, playlistId, jwtToken, }) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxVisibleItems = 5;

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // ✅ 自前の moveItem 実装
  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    const updated = [...playlistItems];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    setPlaylistItems(updated);
  };

  const handleRemove = async (itemId: number) => {
    const confirm = window.confirm('この動画をプレイリストから削除しますか？');
    if (!confirm) return;

    const success = await handleRemoveItem(playlistId, itemId, jwtToken);
    if (success) {
      const updated = playlistItems.filter((item) => item.id !== itemId);
      setPlaylistItems(updated);
    } else {
      alert('プレイリストからの削除に失敗しました');
    }
  };

  const totalSeconds = playlistItems.reduce((sum, item) => sum + (item.youtube_video.duration || 0), 0);

  return (
    <div>
      <h2 style={{ color: theme === 'light' ? '#818cf8' : '#000', marginBottom: '12px' }}>
        作成したプレイリスト（並び替え可能）
      </h2>

      <p className="text-sm text-gray-500 mb-3">
        動画数: {playlistItems.length}本 / 合計時間: {formatDuration(totalSeconds)}
      </p>

      <div style={{ height: '390px', overflowY: 'auto', position: 'relative' }}>
        {playlistItems
          .slice(0, isExpanded ? playlistItems.length : maxVisibleItems)
          .map((item, index) => (
            <PlaylistItemComponent
              key={item.id}
              item={item}
              index={index}
              moveItem={handleMoveItem}
              onRemove={handleRemove}
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
                backgroundColor: '#1bb89a',
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

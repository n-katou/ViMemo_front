import React from 'react';
import useDragDropVideoCard from '../../../hooks/mypage/favorite_videos/useDragDropVideoCard';  // 修正したフックを使います

// 動画のLike型を定義
interface Like {
  likeable_id: number;
  title: string | null;
}

// プレイリストの1つのアイテムコンポーネント
interface PlaylistItemProps {
  like: Like;
  index: number;
  moveItem: (fromIndex: number, toIndex: number) => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ like, index, moveItem }) => {
  // `useDragDropVideoCard` フックを使用してドラッグ&ドロップの機能を持たせる
  const { dragDropRef, isDragging, isOver } = useDragDropVideoCard(index, moveItem);

  // ドラッグ中の色とスタイルを制御
  const backgroundColor = isDragging ? '#38bdf8' : isOver ? '#22eec5' : 'white';
  const opacity = isDragging ? 0.5 : 1;

  return (
    <div
      ref={dragDropRef}
      className="mb-2"
      style={{
        opacity,
        backgroundColor,
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        color: 'black'
      }}
    >
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
          {index + 1}. {like.title}
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
  return (
    <div>
      {youtubeVideoLikes.map((like, index) => (
        <PlaylistItem
          key={like.likeable_id}
          like={like}
          index={index}
          moveItem={moveItem}
        />
      ))}
    </div>
  );
};

export default SortablePlaylist;

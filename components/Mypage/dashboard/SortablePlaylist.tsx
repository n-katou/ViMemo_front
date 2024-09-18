import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrop, useDrag } from 'react-dnd';

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

const ItemType = 'PLAYLIST_ITEM';

const PlaylistItem: React.FC<PlaylistItemProps> = ({ like, index, moveItem }) => {
  const ref = useRef<HTMLLIElement>(null);

  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveItem(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  dragRef(dropRef(ref));

  const opacity = isDragging ? 0.5 : 1;

  return (
    <li ref={ref} className="mb-2" style={{ opacity }}>
      {like.title ? (
        <span>{index + 1}. {like.title}</span>
      ) : (
        <span>不明な動画 (ID: {like.likeable_id})</span>
      )}
    </li>
  );
};

// 並び替え可能なプレイリスト
interface SortablePlaylistProps {
  youtubeVideoLikes: Like[];
  moveItem: (fromIndex: number, toIndex: number) => void; // 移動のための関数
}

const SortablePlaylist: React.FC<SortablePlaylistProps> = ({ youtubeVideoLikes, moveItem }) => {
  return (
    <ul>
      {youtubeVideoLikes.map((like, index) => (
        <PlaylistItem
          key={like.likeable_id}
          like={like}
          index={index}
          moveItem={moveItem}
        />
      ))}
    </ul>
  );
};

export default SortablePlaylist;

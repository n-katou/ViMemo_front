import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useDragDropVideoCard from '../../../hooks/mypage/favorite_videos/useDragDropVideoCard';

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
  // 画面リロード関数
  const handleReload = () => {
    window.location.reload();  // ページをリロード
  };

  return (
    <div>
      {/* アコーディオン形式でプレイリストを折りたたみ可能にする */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>再生中のプレイリスト（並び替え可能）</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {youtubeVideoLikes.map((like, index) => (
            <PlaylistItem
              key={like.likeable_id}
              like={like}
              index={index}
              moveItem={moveItem}
            />
          ))}
        </AccordionDetails>
      </Accordion>

      {/* リロードボタン */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <button
          onClick={handleReload}
          style={{
            padding: '8px 16px',
            backgroundColor: '#38bdf8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          並び替え確定
        </button>
      </div>
    </div>
  );
};

export default SortablePlaylist;

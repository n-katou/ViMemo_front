import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useDragDropVideoCard from '../../../hooks/mypage/favorite_videos/useDragDropVideoCard';
import { useTheme } from 'next-themes';

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
        flexBasis: 'calc(50% - 16px)', // 各アイテムを一律に設定 (2列に分ける)
        minHeight: '60px',  // 高さを統一
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',  // 垂直方向に中央揃え
        justifyContent: 'center',  // 水平方向に中央揃え
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

  const { theme } = useTheme();

  return (
    <div>
      {/* アコーディオン形式でプレイリストを折りたたみ可能にする */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h6" sx={{ color: theme === 'light' ? '#818cf8' : 'inherit' }}>
            再生中のプレイリスト（並び替え可能）
          </Typography>
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
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          onClick={handleReload}
          style={{
            padding: '12px 24px',
            backgroundColor: '#38bdf8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3182ce'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#38bdf8'}
        >
          並び替え確定
        </button>
      </div>
    </div>
  );
};

export default SortablePlaylist;

import React from 'react';
import { Button } from '@mui/material';

interface Props {
  queryKeyword?: string;
  sortOption: string;
  handleSortChange: (value: string) => void;
  displayMode: 'horizontal' | 'grid';
  toggleDisplayMode: () => void;
  theme?: string;
}

const SearchHeader: React.FC<Props> = ({
  queryKeyword,
  sortOption,
  handleSortChange,
  displayMode,
  toggleDisplayMode,
  theme,
}) => (
  <>
    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r bg-clip-text flex items-center gap-2">
      絞り込み・検索結果
    </h3>
    {queryKeyword && (
      <p className="text-sm mb-4 text-gray-400">
        現在の検索キーワード：<span className="font-semibold text-indigo-400">「{queryKeyword}」</span>
      </p>
    )}
    <div className="flex justify-between items-center mb-4">
      <select
        value={sortOption}
        onChange={(e) => handleSortChange(e.target.value)}
        className={`p-2 rounded border ${theme === 'light'
          ? 'bg-white border-gray-600 text-gray-800'
          : 'bg-gray-800 border-gray-600 text-white'
          }`}
      >
        <option value="created_at_desc">取得順</option>
        <option value="published_at_desc">公開日順</option>
        <option value="likes_desc">いいね数順</option>
        <option value="notes_desc">メモ数順</option>
      </select>
      <Button
        onClick={toggleDisplayMode}
        variant="contained"
        sx={{
          ml: 2,
          backgroundColor: '#c084fc',
          color: 'white',
          '&:hover': { backgroundColor: '#a855f7' },
          fontWeight: 'bold',
          textTransform: 'none',
          borderRadius: '6px',
          boxShadow: 2,
          px: 2,
          py: 1,
          fontSize: '0.675rem',
        }}
      >
        {displayMode === 'horizontal' ? 'グリッド表示に切り替え' : '横スクロールに戻す'}
      </Button>
    </div>
  </>
);

export default SearchHeader;

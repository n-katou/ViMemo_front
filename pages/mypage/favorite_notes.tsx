import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useTheme } from 'next-themes';
import { useFavoriteNotes } from '../../hooks/mypage/favorite_notes/useFavoriteNotes';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import NoteCard from '../../components/Mypage/favorite_notes/NoteCard';
import { useAuth } from '../../context/AuthContext';

const FavoriteNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth(); // 認証コンテキストから現在のユーザーとJWTトークンを取得
  const {
    noteLikes,
    loading,
    error,
    currentPage,
    sortOption,
    itemsPerPage,
    sortNotes,
    handlePageChange,
    handleSortChange,
    isNote,
  } = useFavoriteNotes({ currentUser, jwtToken });

  const { theme } = useTheme(); // テーマフックを使用

  if (loading) {
    console.log("Loading state: ", loading);
    return <LoadingSpinner loading={loading} />;
  }
  if (error) {
    console.error("Error state: ", error);
    return <p>{error}</p>;
  }

  const startIndex = (currentPage - 1) * itemsPerPage; // 開始インデックスを計算
  const endIndex = startIndex + itemsPerPage; // 終了インデックスを計算
  const currentItems = sortNotes(noteLikes).slice(startIndex, endIndex); // 現在のページに表示するアイテムをスライス

  return (
    <div className={`container mx-auto py-8 px-4 ${theme === 'light' ? 'text-[#818cf8]' : 'text-white'}`}>
      <h1 className="text-3xl font-bold">いいねしたメモ一覧</h1>
      <div className="flex justify-end mb-8">
        <select
          value={sortOption}
          onChange={handleSortChange}
          className={`form-select form-select-lg ${theme === 'light' ? 'text-[#818cf8] bg-white border border-gray-400' : 'text-white bg-gray-800 border-gray-600'} rounded-md`}
        >
          <option value="created_at_desc">デフォルト（新しい順）</option>
          <option value="created_at_asc">古い順</option>
          <option value="most_liked">いいね数順</option>
        </select>
      </div>
      {currentItems.length > 0 ? (
        <>
          <Grid container spacing={4}>
            {currentItems.map((like) => {
              const note = like.likeable;
              if (isNote(note)) {
                return (
                  <Grid item xs={12} sm={6} md={4} key={like.id}>
                    <NoteCard note={note} jwtToken={jwtToken || ''} currentUser={currentUser} /> {/* NoteCardコンポーネントをレンダリング */}
                  </Grid>
                );
              }
              return null; // likeableがNoteでない場合はnullを返す
            })}
          </Grid>
          <Box mt={4} display="flex" justifyContent="left">
            <Pagination
              count={Math.ceil(noteLikes.length / itemsPerPage)} // 総ページ数を計算
              page={currentPage} // 現在のページ
              onChange={handlePageChange} // ページ変更時の処理
            />
          </Box>
        </>
      ) : (
        <p>いいねしたメモがありません。</p> // いいねしたメモがない場合のメッセージ
      )}
    </div>
  );
};

export default FavoriteNotesPage;

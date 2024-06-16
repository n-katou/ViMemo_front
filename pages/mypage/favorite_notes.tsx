import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Like } from '../../types/like';
import { Note } from '../../types/note';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Pagination from '../../components/Pagination';
import NoteCard from '../../components/Mypage/favorite_notes/NoteCard'; // NoteCardコンポーネントをインポート
import { fetchNoteLikes } from '../../components/Mypage/favorite_notes/favoriteNotesUtils'; // noteUtilsから関数をインポート
import { useTheme } from 'next-themes'; // useThemeフックをインポート

// likeableがNote型かどうかをチェックするためのタイプガード関数
const isNote = (likeable: any): likeable is Note => {
  return (likeable as Note).content !== undefined;
};

const FavoriteNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth(); // 認証コンテキストから現在のユーザーとJWTトークンを取得
  const router = useRouter();
  const [noteLikes, setNoteLikes] = useState<Like[]>([]); // ノートのいいねリストを管理する状態
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // 現在のページを管理する状態
  const [sortOption, setSortOption] = useState<string>('created_at_desc'); // ソートオプションを追加
  const itemsPerPage = 12; // 1ページあたりのアイテム数を設定
  const { theme } = useTheme(); // テーマフックを使用

  // クエリパラメータを更新する関数
  const updateQueryParams = (page: number, sort: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page, sort },
    }, undefined, { shallow: true });
  };

  // コンポーネントがマウントされたときにノートのいいねを取得するための副作用
  useEffect(() => {
    if (!currentUser || !jwtToken) {
      setLoading(false); // ローディング状態を終了
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchNoteLikes(jwtToken, setNoteLikes, setError, setLoading);
        console.log("Note likes fetched successfully");
      } catch (err) {
        console.error("Error fetching note likes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, jwtToken]);

  useEffect(() => {
    const page = parseInt(router.query.page as string, 10) || 1;
    const sort = router.query.sort as string || 'created_at_desc';

    setCurrentPage(page);
    setSortOption(sort);
  }, [router.query.page, router.query.sort]);

  // ノートのリストをソートする関数
  const sortNotes = (notes: Like[]) => {
    switch (sortOption) {
      case 'created_at_asc':
        return notes.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'most_liked':
        return notes.slice().sort((a, b) => b.likeable.likes_count - a.likeable.likes_count);
      default:
        return notes.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  };

  // ページネーションのためのアイテムのスライス
  const startIndex = (currentPage - 1) * itemsPerPage; // 開始インデックスを計算
  const endIndex = startIndex + itemsPerPage; // 終了インデックスを計算
  const currentItems = sortNotes(noteLikes).slice(startIndex, endIndex); // 現在のページに表示するアイテムをスライス

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    updateQueryParams(value, sortOption);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    updateQueryParams(1, newSortOption);
  };

  if (loading) {
    console.log("Loading state: ", loading);
    return <LoadingSpinner loading={loading} />;
  }
  if (error) {
    console.error("Error state: ", error);
    return <p>{error}</p>;
  }

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

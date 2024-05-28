import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Like } from '../../types/like';
import { Note } from '../../types/note';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Pagination from '../../components/Pagination';
import NoteCard from '../../components/FavoriteNote/NoteCard'; // NoteCardコンポーネントをインポート

// ノートのいいねを取得するための非同期関数
export const fetchNoteLikes = async (
  jwtToken: string,
  setNoteLikes: (data: Like[]) => void,
  setError: (error: string | null) => void,
  setLoading: (loading: boolean) => void
) => {
  setLoading(true);
  setError(null); // エラー状態をリセット

  try {
    // APIリクエストを実行
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mypage`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.data.note_likes) {
      throw new Error('Failed to fetch note likes');
    }

    setNoteLikes(response.data.note_likes); // 取得したデータを状態に設定
  } catch (error) {
    setError('メモのいいねの取得に失敗しました。'); // エラーメッセージを状態に設定
  } finally {
    setLoading(false); // ローディング状態を終了
  }
};

// likeableがNote型かどうかをチェックするためのタイプガード関数
const isNote = (likeable: any): likeable is Note => {
  return (likeable as Note).content !== undefined;
};

const FavoriteNotesPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth(); // 認証コンテキストから現在のユーザーとJWTトークンを取得
  const [noteLikes, setNoteLikes] = useState<Like[]>([]); // ノートのいいねリストを管理する状態
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1); // 現在のページを管理する状態
  const [sortOption, setSortOption] = useState<string>('created_at_desc'); // ソートオプションを追加
  const itemsPerPage = 12; // 1ページあたりのアイテム数を設定

  // コンポーネントがマウントされたときにノートのいいねを取得するための副作用
  useEffect(() => {
    if (!currentUser || !jwtToken) {
      setLoading(false); // ローディング状態を終了
      return;
    }

    fetchNoteLikes(jwtToken, setNoteLikes, setError, setLoading) // ノートのいいねを取得
      .then(() => {
        console.log("Note likes fetched successfully");
      })
      .catch((err) => {
        console.error("Error fetching note likes:", err);
      });
  }, [currentUser, jwtToken, currentPage, sortOption]); // currentUser、jwtToken、currentPage、sortOptionが変更されるたびに実行

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

  if (loading) {
    console.log("Loading state: ", loading);
    return <LoadingSpinner loading={loading} />;
  }
  if (error) {
    console.error("Error state: ", error);
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">いいねしたメモ一覧</h1>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="form-select form-select-lg text-white bg-gray-800 border-gray-600 rounded-md"
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
          <Box mt={4} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(noteLikes.length / itemsPerPage)} // 総ページ数を計算
              page={currentPage} // 現在のページ
              onChange={(event, value) => setCurrentPage(value)} // ページ変更時の処理
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

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '../types/youtubeVideo';
import { useAuth } from '../context/AuthContext';

async function fetchYoutubeVideos(query = '', page = 1) {
  try {
    const authToken = localStorage.getItem('authToken'); // ローカルストレージから認証トークンを取得
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // 認証トークンがある場合、認証ヘッダーを追加
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos?q[title_cont]=${query}&page=${page}`, {
      method: 'GET',
      headers: headers,
      credentials: 'include', // クッキーを送信するための設定
    });

    if (!res.ok) {
      console.error('Fetch error:', res.status, res.statusText);
      return null;
    }

    const data = await res.json();
    if (data && Array.isArray(data.videos)) {
      return { videos: data.videos, pagination: data.pagination };
    } else {
      console.error('Invalid data format');
      return null;
    }
  } catch (error) {
    console.error('Fetch exception:', error);
    return null;
  }
}

const YoutubeVideosPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    current_page: number;
    total_pages: number;
    next_page: number;
    prev_page: number;
  }>({
    current_page: 1, // 初期ページ
    total_pages: 1, // 全ページ数
    next_page: 2, // 次ページがあるかどうか
    prev_page: 0, // 前ページがあるかどうか
  });

  const query = router.query.query as string || ''; // URLからクエリを取得

  useEffect(() => {
    if (!currentUser) {
      // ユーザーがログインしていない場合はログインページへリダイレクト
      router.push('/login');
      setYoutubeVideos([]); // ログアウト時にビデオリストをクリア
      setError(null); // エラーメッセージをクリア
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      const result = await fetchYoutubeVideos(query, pagination.current_page); // 現在のページをフェッチ

      if (result) {
        setYoutubeVideos(result.videos); // 動画データを更新
        setPagination(result.pagination); // ページネーション情報を更新
        setError(null); // エラーメッセージをクリア
      } else {
        setError('YouTube動画を取得できませんでした'); // エラー時
      }
      setLoading(false);
    };

    fetchData(); // データをフェッチ
  }, [pagination.current_page, currentUser, router, query]); // 現在のページや検索クエリが変わるたびにフェッチ

  const handleTitleClick = async (id: number) => {
    console.log("遷移前のID:", id); // 遷移前のIDをログに出力
    const cleanUrl = `/youtube_videos/${id}`;
    await router.push(cleanUrl); // 指定したURLに遷移
    console.log("遷移後のURL:", cleanUrl); // 遷移後のURLをログに出力
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      {youtubeVideos.length > 0 ? (
        <>
          {youtubeVideos.map(video => (
            <div key={video.id} className="mb-6 text-left w-full">
              <h2 onClick={() => handleTitleClick(video.id)}>{video.title}</h2>
              <iframe src={`https://www.youtube.com/embed/${video.youtube_id}`} frameBorder="0" allowFullScreen />
              <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
              <p>動画時間: {video.duration}分</p>
            </div>
          ))}
          <div className="pagination">
            {pagination.prev_page && <button onClick={() => setPagination({ ...pagination, current_page: pagination.prev_page })}>前ページ</button>}
            {pagination.next_page && <button onClick={() => setPagination({ ...pagination, current_page: pagination.next_page })}>次ページ</button>}
          </div>
        </>
      ) : <p>動画がありません。</p>}
      <style jsx>{`
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default YoutubeVideosPage;

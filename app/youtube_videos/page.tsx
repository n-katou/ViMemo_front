"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { YoutubeVideo } from '../types/youtubeVideo';

// YouTube動画をフェッチする非同期関数
async function fetchYoutubeVideos(page = 1) {
  try {
    const authToken = localStorage.getItem('authToken'); // ローカルストレージから認証トークンを取得
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // 認証トークンがある場合、認証ヘッダーを追加
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`https://vimemo.fly.dev/youtube_videos?page=${page}`, {
      // const res = await fetch(`http://localhost:3000/youtube_videos?page=${page}`, {
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
  const router = useRouter(); // ルーターを取得
  // フェッチした動画データとページネーション情報、エラー状態を管理
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
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

  const handleTitleClick = async (id: number) => {
    console.log("遷移前のID:", id); // 遷移前のIDをログに出力
    const cleanUrl = `/youtube_videos/${id}`;
    await router.push(cleanUrl); // 指定したURLに遷移
    console.log("遷移後のURL:", cleanUrl); // 遷移後のURLをログに出力
  };

  // コンポーネントがマウントされたらデータをフェッチ
  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchYoutubeVideos(pagination.current_page); // 現在のページをフェッチ

      if (result) {
        setYoutubeVideos(result.videos); // 動画データを更新
        setPagination(result.pagination); // ページネーション情報を更新
        setError(null); // エラーメッセージをクリア
      } else {
        setError('YouTube動画を取得できませんでした'); // エラー時
      }
    };

    fetchData(); // データをフェッチ
  }, [pagination.current_page]); // 現在のページが変わるたびにフェッチ

  // エラーが発生した場合
  if (error) {
    return (
      <div className="container">
        <h1>YouTube一覧</h1>
        <p>{error}</p> {/* エラーメッセージを表示 */}
      </div>
    );
  }

  return (
    <div className="container">
      <h1>YouTube一覧</h1>
      {youtubeVideos.length > 0 ? (
        <>
          {youtubeVideos.map((video) => (
            <div key={video.id} className="mb-6 text-left w-full">
              <h2 onClick={() => handleTitleClick(video.id)} style={{ cursor: 'pointer' }}>
                {video.title}
              </h2>
              <div className="video-wrapper">
                <iframe
                  className="aspect-video"
                  src={`https://www.youtube.com/embed/${video.youtube_id}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p>公開日: {new Date(video.published_at).toLocaleDateString()}</p>
              <p>動画時間: {video.duration}分</p>
            </div>
          ))}

          {/* ページネーション */}
          <div className="pagination">
            {pagination.prev_page && (
              <button onClick={() => setPagination({ ...pagination, current_page: pagination.prev_page })}>前ページ</button>
            )}
            {pagination.next_page && (
              <button onClick={() => setPagination({ ...pagination, current_page: pagination.next_page })}>次ページ</button>
            )}
          </div>
        </>
      ) : (
        <p>動画がありません。</p>
      )}
    </div>
  );
};

export default YoutubeVideosPage;

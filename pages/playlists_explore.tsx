"use client";

import React, { useEffect, useState } from "react";
import { fetchPublicPlaylists } from "@/components/Playlists/playlistUtils";
import { YoutubeVideo } from '../types/youtubeVideo';
import Link from "next/link";


interface PlaylistItem {
  id: number;
  youtube_video: YoutubeVideo;
}

interface PublicPlaylist {
  id: number;
  name: string;
  user: {
    id: number;
    name: string;
  };
  items_count: number;
  total_duration: number;
  created_at: string;
  playlist_items: PlaylistItem[];
}

const formatDuration = (seconds: number): string => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}分${sec}秒`;
};

const PlaylistsExplorePage: React.FC = () => {
  const [playlists, setPlaylists] = useState<PublicPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<number[]>([]); // 展開中のプレイリストID配列

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchPublicPlaylists(); // プレイリスト＋中身
        setPlaylists(res);
      } catch (err) {
        console.error("プレイリスト取得失敗", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  if (loading) return <div className="p-6 text-gray-500">読み込み中...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">みんなのプレイリスト一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playlists.map((pl) => (
          <div key={pl.id} className="bg-white shadow rounded p-4">
            <h2 className="text-gray-600 text-lg font-semibold mb-1">{pl.name}</h2>
            <p className="text-sm text-gray-600 mb-1">
              作成者: <span className="font-medium">{pl.user.name}</span>
            </p>
            <p className="text-sm text-gray-500">
              動画数: {pl.items_count}本 / 合計時間: {formatDuration(pl.total_duration)}
            </p>
            <p className="text-xs text-gray-400 mb-2">作成日: {new Date(pl.created_at).toLocaleDateString()}</p>

            <button
              onClick={() => toggleExpand(pl.id)}
              className="mt-2 text-indigo-600 hover:underline text-sm"
            >
              {expandedIds.includes(pl.id) ? '▲ 閉じる' : '▼ 中身を表示'}
            </button>

            {expandedIds.includes(pl.id) && (
              <ul className="mt-3 space-y-2 text-sm text-gray-700">
                {pl.playlist_items.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <img
                      src={`https://img.youtube.com/vi/${item.youtube_video.youtube_id}/default.jpg`}
                      alt="thumbnail"
                      className="w-12 h-7 rounded object-cover"
                    />
                    <Link href={`/youtube_videos/${item.youtube_video.id}`} className="truncate text-blue-600 hover:underline">
                      {item.youtube_video.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsExplorePage;

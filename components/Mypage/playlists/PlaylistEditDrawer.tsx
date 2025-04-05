import React, { useState, useEffect } from "react";
import { fetchFavorites } from "../../../components/Mypage/favorite_videos/favoriteVidoesUtils";
import { createPlaylist, addVideoToPlaylist } from "./playlistUtils";
import SelectableVideoCard from "./SelectableVideoCard";

interface PlaylistEditDrawerProps {
  open: boolean;
  onClose: () => void;
  jwtToken: string;
  currentUser: {
    id: number;
    email: string;
  };
  onPlaylistCreated: (playlist: { id: number; name: string }) => void;
}

const PlaylistEditDrawer: React.FC<PlaylistEditDrawerProps> = ({
  open,
  onClose,
  jwtToken,
  currentUser,
  onPlaylistCreated,
}) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!jwtToken || !open) return;

    const load = async () => {
      try {
        const res = await fetchFavorites(1, "like", jwtToken, currentUser, 1000);
        setVideos(res?.videos || []);
      } catch (e) {
        console.error("お気に入り動画の取得に失敗しました", e);
        setVideos([]);
      }
    };

    load();
  }, [jwtToken, currentUser, open]);

  const toggleSelection = (videoId: number) => {
    setSelected((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
  };

  const handleSubmit = async () => {
    if (!name || selected.length === 0) {
      alert("プレイリスト名と動画選択は必須です。");
      return;
    }

    try {
      const playlist = await createPlaylist(name, jwtToken);
      await Promise.all(
        selected.map((id) => addVideoToPlaylist(playlist.id, id, jwtToken))
      );

      // ✅ 通知＆親に反映
      onPlaylistCreated(playlist);

      // 入力クリア（リセットして再度開いたときのため）
      setName("");
      setSelected([]);
    } catch (err) {
      console.error("プレイリスト作成に失敗:", err);
      alert("プレイリストの作成に失敗しました。");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed right-0 top-0 w-full max-w-5xl h-full bg-white shadow-lg z-50 flex flex-col pt-16 pb-28 px-6">
      <h2 className="text-xl font-bold mb-4">新しいプレイリストを作成</h2>
      <input
        type="text"
        placeholder="プレイリスト名"
        className="w-full p-2 border rounded mb-4"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* 中央スクロール領域 */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {videos.map((video) => (
            <SelectableVideoCard
              key={video.id}
              video={video}
              selected={selected.includes(video.id)}
              onToggle={() => toggleSelection(video.id)}
            />
          ))}
        </div>
      </div>
      {/* 下部ボタン固定 */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => {
            setName("");
            setSelected([]);
            onClose();
          }}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-200 active:scale-95"
        >
          キャンセル
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-white rounded"
          style={{ backgroundColor: '#38bdf8' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0ea5e9')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#38bdf8')}
        >
          作成
        </button>
      </div>
    </div>
  );
};

export default PlaylistEditDrawer;

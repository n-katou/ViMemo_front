"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchPlaylists,
  fetchPlaylistItems,
  deletePlaylist,
  renamePlaylist
} from "@/components/Mypage/playlists/playlistUtils";
import PlaylistSidebar from "@/components/Mypage/playlists/PlaylistSidebar";
import PlaylistVideos from "@/components/Mypage/playlists/PlaylistVideos";
import PlaylistEditDrawer from "@/components/Mypage/playlists/PlaylistEditDrawer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const PlaylistPage = () => {
  const { currentUser, jwtToken } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [playlistItems, setPlaylistItems] = useState<any[]>([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // ← 開閉用の状態を追加

  if (!jwtToken) return <div className="p-6 text-gray-500">読み込み中...</div>;

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const res = await fetchPlaylists(jwtToken);
        setPlaylists(res);
      } catch (err) {
        console.error("プレイリスト取得失敗:", err);
      }
    };
    loadPlaylists();
  }, [jwtToken]);

  useEffect(() => {
    if (!selectedPlaylistId) return;
    fetchPlaylistItems(selectedPlaylistId, jwtToken).then((items) =>
      setPlaylistItems(items)
    );
  }, [selectedPlaylistId, jwtToken]);

  const handleDeletePlaylist = async (playlistId: number) => {
    if (!window.confirm("このプレイリストを削除しますか？")) return;

    try {
      await deletePlaylist(playlistId, jwtToken);
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      if (selectedPlaylistId === playlistId) {
        setSelectedPlaylistId(null);
        setPlaylistItems([]);
      }
    } catch (err) {
      console.error("削除失敗:", err);
      alert("削除に失敗しました");
    }
  };

  const handleRenamePlaylist = async (id: number, newName: string) => {
    try {
      await renamePlaylist(id, newName, jwtToken);
      setPlaylists((prev) =>
        prev.map((pl) => (pl.id === id ? { ...pl, name: newName } : pl))
      );
    } catch {
      alert("プレイリスト名の変更に失敗しました");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="relative h-screen w-full">
        {/* 開閉ボタン */}
        <div
          className={`fixed top-[100px] z-50 transition-all duration-300 ${showSidebar ? "right-4 md:left-64" : "left-4"
            }`}
        >
          <button
            className="p-2 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? (
              <ChevronLeftIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </button>
        </div>
        <div className="flex h-full overflow-hidden">
          {/* サイドバー表示を制御 */}
          {showSidebar && (
            <PlaylistSidebar
              playlists={playlists}
              selectedId={selectedPlaylistId}
              onSelect={setSelectedPlaylistId}
              onAddClick={() => setEditDrawerOpen(true)}
              onDelete={handleDeletePlaylist}
              onRename={handleRenamePlaylist}
              onCloseSidebar={() => setShowSidebar(false)}
            />
          )}

          {/* メイン */}
          <div className="flex-1 overflow-y-auto pt-16 pb-28 px-6">
            {selectedPlaylistId === null ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-lg">
                プレイリストを選択してください
              </div>
            ) : (
              <PlaylistVideos
                playlistItems={playlistItems}
                setPlaylistItems={setPlaylistItems}
                jwtToken={jwtToken}
                playlistId={selectedPlaylistId}
              />
            )}
          </div>
        </div>

        {/* Drawer */}
        {currentUser && (
          <PlaylistEditDrawer
            open={editDrawerOpen}
            onClose={() => setEditDrawerOpen(false)}
            jwtToken={jwtToken}
            currentUser={{
              id: Number(currentUser.id),
              email: currentUser.email,
            }}
            onPlaylistCreated={(newPlaylist) => {
              setPlaylists((prev) => [...prev, newPlaylist]);
              setSelectedPlaylistId(newPlaylist.id);
              setEditDrawerOpen(false);
            }}
          />
        )}
      </main>
    </DndProvider>
  );
};

export default PlaylistPage;

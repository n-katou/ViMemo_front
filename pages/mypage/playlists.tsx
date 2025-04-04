"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchPlaylists,
  fetchPlaylistItems,
} from "@/components/Mypage/playlists/playlistUtils";
import PlaylistSidebar from "@/components/Mypage/playlists/PlaylistSidebar";
import PlaylistVideos from "@/components/Mypage/playlists/PlaylistVideos";
import PlaylistEditDrawer from "@/components/Mypage/playlists/PlaylistEditDrawer";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const PlaylistPage = () => {
  const { currentUser, jwtToken } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [playlistItems, setPlaylistItems] = useState<any[]>([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  // 認証が未取得の間は読み込み表示
  if (!jwtToken) return <div className="p-6 text-gray-500">読み込み中...</div>;

  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const res = await fetchPlaylists(jwtToken);
        setPlaylists(res);
        // デフォルトで何も選ばない
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex w-full h-screen overflow-hidden">
        <PlaylistSidebar
          playlists={playlists}
          selectedId={selectedPlaylistId}
          onSelect={setSelectedPlaylistId}
          onAddClick={() => setEditDrawerOpen(true)}
        />

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
      </div>
    </DndProvider>
  );
};

export default PlaylistPage;

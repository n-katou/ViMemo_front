"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchPlaylists,
  fetchPlaylistItems,
} from "@/components/Mypage/playlists/playlistUtils";
import PlaylistSidebar from "@/components/Mypage/playlists//PlaylistSidebar";
import PlaylistVideos from "@/components/Mypage/playlists//PlaylistVideos";
import PlaylistEditDrawer from "@/components/Mypage/playlists//PlaylistEditDrawer";

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const PlaylistPage = () => {
  const { currentUser, jwtToken } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [playlistItems, setPlaylistItems] = useState<any[]>([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);

  useEffect(() => {
    if (!jwtToken) return;
    fetchPlaylists(jwtToken).then((res) => {
      setPlaylists(res);
      if (res.length > 0) setSelectedPlaylistId(res[0].id);
    });
  }, [jwtToken]);

  useEffect(() => {
    if (!jwtToken || !selectedPlaylistId) return;
    fetchPlaylistItems(selectedPlaylistId, jwtToken).then((items) =>
      setPlaylistItems(items)
    );
  }, [selectedPlaylistId, jwtToken]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex w-full h-screen">
        <PlaylistSidebar
          playlists={playlists}
          selectedId={selectedPlaylistId}
          onSelect={setSelectedPlaylistId}
          onAddClick={() => setEditDrawerOpen(true)}
        />
        <PlaylistVideos playlistItems={playlistItems} />
        {jwtToken && currentUser && (
          <PlaylistEditDrawer
            open={editDrawerOpen}
            onClose={() => setEditDrawerOpen(false)}
            jwtToken={jwtToken}
            currentUser={{
              id: Number(currentUser.id),
              email: currentUser.email
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

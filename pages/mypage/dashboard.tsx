import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useAuth } from '../../context/AuthContext';
import { useDashboardData } from '../../hooks/mypage/dashboard/useDashboardData';
import { fetchPlaylists, fetchPlaylistItems } from "@/components/Mypage/playlists/playlistUtils";

import LoadingSpinner from '../../components/LoadingSpinner';
import UserCard from '../../components/Mypage/dashboard/UserCard';
import SearchForm from '../../components/Mypage/dashboard/SearchForm';
import SortablePlaylist from '../../components/Mypage/dashboard/SortablePlaylist';
import PlaylistPlayerAccordion from '../../components/Mypage/dashboard/PlaylistPlayerAccordion';

const Dashboard = () => {
  const { currentUser, jwtToken, loading, setAuthState } = useAuth();
  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    flashMessage,
    showSnackbar,
    handleSearch,
    handleCloseSnackbar,
  } = useDashboardData({ jwtToken, currentUser, setAuthState });

  const isAdmin = currentUser?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  // ✅ Hook は return より上で定義！
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<number | null>(null);
  const [playlistItems, setPlaylistItems] = useState<any[]>([]);

  useEffect(() => {
    if (!jwtToken) return;

    const loadPlaylists = async () => {
      try {
        const res = await fetchPlaylists(jwtToken);
        setPlaylists(res);

        const lastSelectedId = localStorage.getItem('lastSelectedPlaylistId');
        const idToUse = lastSelectedId ? Number(lastSelectedId) : res[0]?.id;

        if (idToUse) {
          setSelectedPlaylistId(idToUse);
        }
      } catch (err) {
        console.error("プレイリストの取得に失敗しました", err);
      }
    };

    loadPlaylists();
  }, [jwtToken]);

  useEffect(() => {
    if (!selectedPlaylistId || !jwtToken) return;

    const loadPlaylistVideos = async () => {
      try {
        const items = await fetchPlaylistItems(selectedPlaylistId, jwtToken);
        setPlaylistItems(items);
      } catch (err) {
        console.error("プレイリスト内の動画取得に失敗しました:", err);
        setPlaylistItems([]);
      }
    };

    loadPlaylistVideos();
  }, [selectedPlaylistId, jwtToken]);

  useEffect(() => {
    const stored = localStorage.getItem('lastSelectedPlaylistId');
    if (stored && playlists.length > 0) {
      const parsedId = Number(stored);
      const exists = playlists.some(p => p.id === parsedId);
      if (exists) {
        setSelectedPlaylistId(parsedId);
      } else {
        localStorage.removeItem('lastSelectedPlaylistId');
        setSelectedPlaylistId(playlists[0]?.id ?? null);
      }
    }
  }, [playlists]);

  const updatePlaylistOrderForPlaylist = async (
    playlistId: number,
    jwtToken: string,
    items: any[]
  ) => {
    const videoIds = items.map((item) => item.youtube_video.id);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/playlists/${playlistId}/playlist_items/update_multiple`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ video_ids: videoIds }),
      });
    } catch (err) {
      console.error("プレイリストの順序保存に失敗しました", err);
    }
  };

  // ✅ useStateなどは return より上にあるのでOK！
  if (loading) {
    return <LoadingSpinner loading={loading} />;
  }

  if (!currentUser) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl">ログインして下さい。</p></div>;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full px-6 py-8 mt-4">
        {/* ユーザーカードエリア */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4 mb-8 md:mb-0">
            <UserCard currentUser={currentUser} isAdmin={isAdmin} />
          </div>
          <div className="w-full md:flex-1 md:pl-8">
            <SearchForm
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              suggestions={suggestions}
              handleSearch={handleSearch}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full mt-8 gap-8">
          {/* プレイヤーエリア */}
          <div className="w-full md:w-2/3">
            {selectedPlaylistId && jwtToken && (
              <PlaylistPlayerAccordion
                playlistItems={playlistItems}
                setPlaylistItems={setPlaylistItems}
                updatePlaylistOrder={updatePlaylistOrderForPlaylist}
                playlistId={selectedPlaylistId}
                jwtToken={jwtToken}
              />
            )}
          </div>

          {/* プレイリストエリア */}
          <div
            className="w-full md:w-1/3 bg-white shadow-md rounded-lg p-6"
            style={{
              height: '620px', // ← プレイヤーに合わせて完全固定
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {playlists.length > 0 && (
              <div className="mb-4">
                <label htmlFor="playlistSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  プレイリストを選択:
                </label>
                <select
                  id="playlistSelect"
                  className="block w-full p-2 border rounded"
                  value={selectedPlaylistId ?? ''}
                  onChange={(e) => setSelectedPlaylistId(Number(e.target.value))}
                >
                  {playlists.map((playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <SortablePlaylist
              playlistItems={playlistItems}
              setPlaylistItems={setPlaylistItems}
            />
          </div>
        </div>

        {/* スナックバーによるメッセージ表示 */}
        {flashMessage && (
          <Snackbar
            open={showSnackbar}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              {flashMessage}
            </Alert>
          </Snackbar>
        )}
      </div>
    </DndProvider>
  );
};

export default Dashboard;

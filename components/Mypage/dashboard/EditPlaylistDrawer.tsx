import React from 'react';
import Drawer from '@mui/material/Drawer';
import PlaylistVideos from "@/components/Mypage/playlists/PlaylistVideos";
import { PlaylistItem } from '../../../types/playlistItem';

interface Props {
  open: boolean;
  onClose: () => void;
  playlistItems: PlaylistItem[];
  setPlaylistItems: React.Dispatch<React.SetStateAction<PlaylistItem[]>>; // ← ここを修正！
  playlistId: number;
  jwtToken: string;
}

const EditPlaylistDrawer: React.FC<Props> = ({
  open,
  onClose,
  playlistItems,
  setPlaylistItems,
  playlistId,
  jwtToken
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: '400px', padding: '16px' }}>
        <h2 className="text-lg font-bold mb-4">プレイリストを編集</h2>
        <PlaylistVideos
          playlistItems={playlistItems}
          setPlaylistItems={setPlaylistItems}
          jwtToken={jwtToken}
          playlistId={playlistId}
        />
        <button onClick={onClose} className="mt-4 text-sm text-blue-600 underline">
          閉じる
        </button>
      </div>
    </Drawer>
  );
};

export default EditPlaylistDrawer;

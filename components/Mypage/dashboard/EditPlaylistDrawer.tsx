import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { PlaylistItem } from '../../../types/playlistItem';
import PlaylistVideos from '@/components/Mypage/playlists/PlaylistVideos';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface Props {
  open: boolean;
  onClose: () => void;
  playlistItems: PlaylistItem[];
  setPlaylistItems: React.Dispatch<React.SetStateAction<PlaylistItem[]>>;
  playlistId: number;
  jwtToken: string;
}

const EditPlaylistDialog: React.FC<Props> = ({
  open,
  onClose,
  playlistItems,
  setPlaylistItems,
  playlistId,
  jwtToken
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen // ← 全デバイスで全画面表示
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: 0, // ← 全画面用に角丸をなくす
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'none', // ← 全画面なら影は不要かも
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0px 2px 10px rgba(255, 255, 255, 0.5)',
        }}
      >
        プレイリストを編集
        <IconButton
          edge="end"
          onClick={onClose}
          aria-label="close"
          sx={{
            color: 'white',
            transition: '0.3s',
            '&:hover': { color: 'red' },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <PlaylistVideos
          playlistItems={playlistItems}
          setPlaylistItems={setPlaylistItems}
          jwtToken={jwtToken}
          playlistId={playlistId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditPlaylistDialog;

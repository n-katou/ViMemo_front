import React, { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { useTheme } from 'next-themes';
import { PlaylistItem } from '@/types/playlistItem';
import CustomSpinner from './CustomSpinner';

interface Props {
  playlistItems: PlaylistItem[];
  setPlaylistItems: (items: PlaylistItem[]) => void;
  updatePlaylistOrder: (playlistId: number, jwtToken: string, items: PlaylistItem[]) => Promise<void>;
  playlistId: number;
  jwtToken: string;
}

const PlaylistPlayerAccordion: React.FC<Props> = ({
  playlistItems,
  setPlaylistItems,
  updatePlaylistOrder,
  playlistId,
  jwtToken
}) => {
  const { theme } = useTheme();
  const [isShuffling, setIsShuffling] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const sortedItems = [...playlistItems].sort((a, b) => a.position - b.position);
  const videoIds = sortedItems
    .map(item => item.youtube_video.youtube_id)
    .filter(id => typeof id === 'string' && id.trim().length > 0);

  const playlistUrl = `https://www.youtube.com/embed/videoseries?playlist=${videoIds.join(',')}&autoplay=0&rel=0`;

  const handleShuffle = () => {
    setIsShuffling(true);
    setTimeout(() => {
      const shuffled = [...playlistItems]
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map((item, index) => ({ ...item.value, position: index + 1 }));
      setPlaylistItems(shuffled);
      setIsShuffling(false);
    }, 1000);
  };

  const handleConfirmOrder = async () => {
    setIsSaving(true);
    await updatePlaylistOrder(playlistId, jwtToken, playlistItems);
    setIsSaving(false);
    window.location.reload(); // 任意で再読み込み
  };

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ color: theme === 'light' ? '#818cf8' : 'inherit' }}>
          選択中のプレイリストの動画プレイヤー
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {videoIds.length > 0 ? (
          <iframe
            src={playlistUrl}
            allowFullScreen
            className="w-full aspect-video large-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="YouTube playlist"
          />
        ) : (
          <Typography>プレイリストに動画がありません。</Typography>
        )}

        <Box textAlign="center" mt={2}>
          <Button
            variant="contained"
            startIcon={<ShuffleIcon />}
            onClick={handleShuffle}
            disabled={isShuffling}
            sx={{
              backgroundColor: isShuffling ? '#ccc' : '#22eec5',
              color: isShuffling ? 'gray' : 'white',
              marginRight: '16px',
              '&:hover': {
                backgroundColor: '#1bb89a',
              },
            }}
          >
            {isShuffling ? 'シャッフル中...' : 'プレイリストをシャッフル'}
          </Button>

          <Button
            variant="contained"
            onClick={handleConfirmOrder}
            disabled={isSaving}
            sx={{
              backgroundColor: isSaving ? '#ccc' : '#38bdf8',
              color: isSaving ? 'gray' : 'white',
              '&:hover': {
                backgroundColor: '#1e90ff',
              },
            }}
          >
            {isSaving ? '保存中...' : '並び替え確定'}
          </Button>
        </Box>

        {isShuffling && <CustomSpinner size={120} bgColor="rgba(0, 0, 0, 0.6)" />}
      </AccordionDetails>
    </Accordion>
  );
};

export default PlaylistPlayerAccordion;

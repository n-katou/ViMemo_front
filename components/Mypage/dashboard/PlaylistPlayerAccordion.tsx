import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from 'next-themes';
import { PlaylistItem } from '@/types/playlistItem'; // ← ここは実際の定義に合わせて変更

interface Props {
  playlistItems: PlaylistItem[]; // ← PlaylistItem 型を渡すように変更
}

const PlaylistPlayerAccordion: React.FC<Props> = ({ playlistItems }) => {
  const { theme } = useTheme();

  const sortedItems = [...playlistItems].sort((a, b) => a.position - b.position);
  const videoIds = sortedItems
    .map(item => item.youtube_video.youtube_id)
    .filter(id => typeof id === 'string' && id.trim().length > 0);

  const playlistUrl = videoIds.length > 0
    ? `https://www.youtube.com/embed/videoseries?playlist=${videoIds.join(',')}&autoplay=1&rel=0`
    : '';

  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6" sx={{ color: theme === 'light' ? '#818cf8' : 'inherit' }}>
          選択中のプレイリストの動画プレイヤー
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {playlistUrl ? (
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
      </AccordionDetails>
    </Accordion>
  );
};


export default PlaylistPlayerAccordion;

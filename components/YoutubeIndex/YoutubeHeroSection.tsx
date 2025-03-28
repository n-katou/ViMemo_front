import React from 'react';
import ReactPlayer from 'react-player';
import { YoutubeVideo } from '../../types/youtubeVideo';
import GradientButton from '../../styles/GradientButton';
import IconButton from '@mui/material/IconButton';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { motion, AnimatePresence } from 'framer-motion';

interface YoutubeHeroSectionProps {
  video: YoutubeVideo;
  isMuted: boolean;
  toggleMute: () => void;
  onClickWatch: () => void;
}

const YoutubeHeroSection: React.FC<YoutubeHeroSectionProps> = ({
  video,
  isMuted,
  toggleMute,
  onClickWatch,
}) => {
  return (
    <div className="relative w-full h-[60vh] mb-12 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={video.id}
          initial={{ opacity: 0, scale: 1.05, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* 動画 */}
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${video.youtube_id}`}
            playing
            muted={isMuted}
            controls={false}
            volume={isMuted ? 0 : 1}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          />

          {/* グラデーション */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />

          {/* タイトル・ボタン */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-10 left-10 z-20 text-white"
          >
            <h2 className="text-4xl font-bold mb-4 max-w-2xl drop-shadow-xl">
              {video.title}
            </h2>
            <GradientButton
              onClick={onClickWatch}
              variant="contained"
              sx={{
                textTransform: 'uppercase',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              今すぐ見る
            </GradientButton>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* ミュートボタン（右下固定） */}
      <IconButton
        onClick={toggleMute}
        sx={{
          position: 'absolute',
          top: 60, // ← 以前は 20
          right: 40, // ← 以前は 20
          width: 48,
          height: 48,
          border: '2px solid white',
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.4)',
          color: 'white',
          zIndex: 30,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'scale(1.1)',
          },
        }}
      >
        {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
    </div>
  );
};

export default YoutubeHeroSection;

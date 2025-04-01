import { useState } from 'react';

export const useTimestamp = (getPlayer: () => any) => {
  const [timestampMinutes, setTimestampMinutes] = useState('');
  const [timestampSeconds, setTimestampSeconds] = useState('');

  const setTimestamp = async () => {
    const player = getPlayer(); // 毎回最新のplayerを取得

    if (player?.getCurrentTime) {
      try {
        const time = await player.getCurrentTime();
        if (typeof time === 'number' && !isNaN(time)) {
          const minutes = Math.floor(time / 60);
          const seconds = Math.floor(time % 60);
          setTimestampMinutes(minutes.toString());
          setTimestampSeconds(seconds.toString());
        }
      } catch {
        // 無視（アラート不要）
      }
    }
  };

  return {
    timestampMinutes,
    setTimestampMinutes,
    timestampSeconds,
    setTimestampSeconds,
    setTimestamp,
  };
};

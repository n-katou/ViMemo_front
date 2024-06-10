import { useState } from 'react';

export const useTimestamp = (player: any) => {
  const [timestampMinutes, setTimestampMinutes] = useState('');
  const [timestampSeconds, setTimestampSeconds] = useState('');

  const setTimestamp = () => {
    if (player && player.getCurrentTime) {
      const currentTime = player.getCurrentTime();
      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      setTimestampMinutes(minutes.toString());
      setTimestampSeconds(seconds.toString());
    } else {
      console.log('Player or getCurrentTime is not available');
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

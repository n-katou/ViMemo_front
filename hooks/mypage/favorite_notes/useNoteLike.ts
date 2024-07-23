import { useState, useEffect } from 'react';
import { handleNoteLike, handleNoteUnlike, fetchCurrentUserLike } from '../../../src/api';

const useNoteLike = (youtubeVideoId: number, noteId: number, jwtToken?: string) => {
  const [liked, setLiked] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [likeId, setLikeId] = useState<number | null>(null);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (jwtToken) {
        try {
          const fetchedLikeId = await fetchCurrentUserLike(youtubeVideoId, noteId, jwtToken);
          if (fetchedLikeId) {
            setLiked(true);
            setLikeId(fetchedLikeId);
          } else {
            setLiked(false);
            setLikeId(null);
          }
        } catch (error) {
          console.error('Failed to fetch current user like status:', error);
        }
      }
    };

    fetchLikeStatus();
  }, [youtubeVideoId, noteId, jwtToken]);

  const handleLike = async () => {
    if (!jwtToken) return;

    if (liked && likeId !== null) {
      const result = await handleNoteUnlike(youtubeVideoId, noteId, likeId, jwtToken);
      if (result.success) {
        setLiked(false);
        setLikeId(null);
        setLikesCount(prevCount => prevCount - 1);
        setLikeError(null);
      } else {
        setLikeError(result.error);
      }
    } else {
      const result = await handleNoteLike(youtubeVideoId, noteId, jwtToken);
      if (result.success) {
        setLiked(true);
        setLikeId(result.like_id);
        setLikesCount(prevCount => prevCount + 1);
        setLikeError(null);
      } else {
        setLikeError(result.error);
      }
    }
  };

  return { liked, likesCount, handleLike, likeError };
};

export default useNoteLike;

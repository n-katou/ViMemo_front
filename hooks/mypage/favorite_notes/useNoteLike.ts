import { useState, useEffect } from 'react';
import { handleNoteLike, handleNoteUnlike, fetchCurrentUserLike } from '../../../src/api';
import { Note } from '../../../types/note';

interface UseNoteLikeProps {
  note: Note;
  jwtToken?: string;
}

const useNoteLike = ({ note, jwtToken }: UseNoteLikeProps) => {
  const [liked, setLiked] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [likeId, setLikeId] = useState<number | null>(null);
  const [likesCount, setLikesCount] = useState(note.likes_count);

  const fetchLikeStatus = async () => {
    if (jwtToken) {
      try {
        const fetchedLikeId = await fetchCurrentUserLike(note.youtube_video_id, note.id, jwtToken);
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

  useEffect(() => {
    fetchLikeStatus();
  }, [note.youtube_video_id, note.id, jwtToken]);

  const handleLike = async () => {
    if (!jwtToken) return;

    if (liked && likeId !== null) {
      const result = await handleNoteUnlike(note.youtube_video_id, note.id, likeId, jwtToken);
      if (result.success) {
        setLiked(false);
        setLikeId(null);
        setLikesCount(prevCount => prevCount - 1);
        setLikeError(null);
      } else {
        setLikeError(result.error);
      }
    } else {
      const result = await handleNoteLike(note.youtube_video_id, note.id, jwtToken);
      if (result.success) {
        setLiked(true);
        setLikeId(result.like_id);
        setLikesCount(prevCount => prevCount + 1);
        setLikeError(null);
      } else {
        setLikeError(result.error);
      }
    }
    await fetchLikeStatus();
  };

  return {
    liked,
    likeError,
    likesCount,
    handleLike
  };
};

export default useNoteLike;

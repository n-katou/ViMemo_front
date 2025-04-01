import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../../types/youtubeVideo';
import { Note } from '../../../types/note';
import { useAuth } from '../../../context/AuthContext';
import { fetchYoutubeVideo } from '../../../src/api';
import { formatDuration } from '../../../components/YoutubeShow/youtubeShowUtils';

const useYoutubeVideoShowPage = () => {
  const [video, setVideo] = useState<YoutubeVideo & { formattedDuration?: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [isNoteFormVisible, setIsNoteFormVisible] = useState<boolean>(false);
  const [showMyNotes, setShowMyNotes] = useState<boolean>(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(true);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, jwtToken, loading } = useAuth();
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = () => {
      if (!pathname) return;

      const pathSegments = pathname.split('/');
      const videoId = parseInt(pathSegments[pathSegments.length - 1], 10);

      if (!isNaN(videoId)) {
        fetchYoutubeVideo(videoId, jwtToken)
          .then(videoData => {
            setVideo({ ...videoData.youtube_video, formattedDuration: formatDuration(videoData.youtube_video.duration) });
            setNotes(videoData.notes);

            const likes = videoData.youtube_video.likes || [];
            setLiked(likes.some((like: any) => like.user_id === Number(currentUser?.id)));
          })
          .catch(error => {
            console.error('Error loading the video:', error);
            setVideo(null);
          })
          .finally(() => {
            setDataLoading(false);
          });
      } else {
        console.error('Invalid videoId');
        setDataLoading(false);
      }
    };

    fetchData();
  }, [pathname, jwtToken, currentUser, showMyNotes]);

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const filteredNotes = showMyNotes
    ? notes.filter(note => note.user.id === currentUser?.id)
    : notes;

  return {
    video,
    notes,
    likeError,
    liked,
    isNoteFormVisible,
    showMyNotes,
    isSnackbarOpen,
    dataLoading,
    currentUser,
    jwtToken,
    loading,
    playerRef,
    router,
    setVideo,
    setNotes,
    setLiked,
    setLikeError,
    setIsNoteFormVisible,
    setShowMyNotes,
    handleSnackbarClose,
    filteredNotes,
  };
};

export default useYoutubeVideoShowPage;

import axios from 'axios';
import { NoteWithVideoTitle } from '../../../types/note';

const useHandleDeleteNote = (jwtToken: string | null, setNotes: React.Dispatch<React.SetStateAction<NoteWithVideoTitle[]>>) => {
  const handleDeleteNote = async (youtubeVideoId: number, noteId: number) => {
    try {
      const deleteUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${youtubeVideoId}/notes/${noteId}`;
      await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  return handleDeleteNote;
};

export default useHandleDeleteNote;

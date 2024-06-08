import { NoteWithVideoTitle } from '../types/note'; // 必要に応じてインポートパスを調整

interface GroupedNotes {
  [videoId: number]: {
    video_title: string;
    notes: NoteWithVideoTitle[];
  };
}

export const groupNotesByVideoId = (notes: NoteWithVideoTitle[]): GroupedNotes => {
  return notes.reduce((acc, note) => {
    if (!acc[note.youtube_video_id]) {
      acc[note.youtube_video_id] = {
        video_title: note.video_title,
        notes: [],
      };
    }
    acc[note.youtube_video_id].notes.push(note);
    return acc;
  }, {} as GroupedNotes);
};

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { NoteWithVideoTitle } from '../../../types/note';

interface UseFetchNotesProps {
  jwtToken: string | null;
  currentUser: any;
}

const useFetchNotes = ({ jwtToken, currentUser }: UseFetchNotesProps) => {
  const router = useRouter();
  const [notes, setNotes] = useState<NoteWithVideoTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('created_at_desc');

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchNotes = async (sort: string) => {
      try {
        const userNotesUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/my_notes?sort=${sort}`;
        const res = await axios.get(userNotesUrl, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (res.data.notes) {
          setNotes(res.data.notes);
        } else {
          setError('メモの取得に失敗しました。');
        }
      } catch (err) {
        setError('メモの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    const querySort = router.query.sort as string || 'created_at_desc';
    setSortOption(querySort);
    fetchNotes(querySort);
  }, [currentUser, jwtToken, router.query.sort]);

  return { notes, loading, error, sortOption, setNotes };
};

export default useFetchNotes;

// src/hooks/mypage/favorite_notes/useFavoriteNotes.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { fetchNoteLikes } from '../../../components/Mypage/favorite_notes/favoriteNotesUtils';
import { Like } from '../../../types/like';
import { Note } from '../../../types/note';

interface UseFavoriteNotesProps {
  currentUser: any;
  jwtToken: string | null;
}

const isNote = (likeable: any): likeable is Note => {
  return (likeable as Note).content !== undefined;
};

export const useFavoriteNotes = ({ currentUser, jwtToken }: UseFavoriteNotesProps) => {
  const router = useRouter();
  const [noteLikes, setNoteLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortOption, setSortOption] = useState<string>('created_at_desc');
  const itemsPerPage = 12;

  const updateQueryParams = (page: number, sort: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page, sort },
    }, undefined, { shallow: true });
  };

  useEffect(() => {
    if (!currentUser || !jwtToken) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchNoteLikes(jwtToken, setNoteLikes, setError, setLoading);
        console.log("Note likes fetched successfully");
      } catch (err) {
        console.error("Error fetching note likes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, jwtToken]);

  useEffect(() => {
    const page = parseInt(router.query.page as string, 10) || 1;
    const sort = router.query.sort as string || 'created_at_desc';

    setCurrentPage(page);
    setSortOption(sort);
  }, [router.query.page, router.query.sort]);

  const sortNotes = (notes: Like[]) => {
    switch (sortOption) {
      case 'created_at_asc':
        return notes.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'most_liked':
        return notes.slice().sort((a, b) => b.likeable.likes_count - a.likeable.likes_count);
      default:
        return notes.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    updateQueryParams(value, sortOption);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    updateQueryParams(1, newSortOption);
  };

  return {
    noteLikes,
    loading,
    error,
    currentPage,
    sortOption,
    itemsPerPage,
    setCurrentPage,
    sortNotes,
    handlePageChange,
    handleSortChange,
    isNote,
  };
};

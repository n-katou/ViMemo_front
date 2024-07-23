import { useState, useEffect } from 'react';
import axios from 'axios';
import { YoutubeVideo } from '@/types/youtubeVideo';

const useSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<YoutubeVideo[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 0) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/autocomplete`, {
            params: { query }
          });
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  return suggestions;
};

export default useSuggestions;

import { useState, useEffect } from 'react';

const useMaxSuggestions = () => {
  const [maxSuggestions, setMaxSuggestions] = useState(10);

  useEffect(() => {
    const handleResize = () => {
      setMaxSuggestions(window.innerWidth <= 600 ? 20 : 20);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return maxSuggestions;
};

export default useMaxSuggestions;

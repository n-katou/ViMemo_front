import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type DisplayMode = 'horizontal' | 'grid';

const useDisplayMode = () => {
  const router = useRouter();
  const [displayMode, setDisplayMode] = useState<DisplayMode>('horizontal');

  useEffect(() => {
    if (router.query.displayMode === 'grid') {
      setDisplayMode('grid');
    } else {
      setDisplayMode('horizontal');
    }
  }, [router.query.displayMode]);

  const toggleDisplayMode = () => {
    const newMode = displayMode === 'horizontal' ? 'grid' : 'horizontal';
    setDisplayMode(newMode);
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, displayMode: newMode },
      },
      undefined,
      { shallow: true }
    );
  };

  const queryKeyword = router.query.query as string | undefined;

  return {
    displayMode,
    toggleDisplayMode,
    queryKeyword,
  };
};

export default useDisplayMode;

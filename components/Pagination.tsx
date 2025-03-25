import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { useTheme } from 'next-themes';
import { useMediaQuery } from '@mui/material';

interface PaginationComponentProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ count, page, onChange }) => {
  const { resolvedTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)'); // Tailwindのsm相当

  return (
    <Stack
      spacing={2}
      className="mt-8"
      direction="row"
      justifyContent="center"
      sx={{
        width: '100%',
        overflowX: 'auto',
        px: isMobile ? 2 : 0, // モバイル時は左右に余白追加
      }}
    >
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        variant="outlined"
        shape="rounded"
        color="primary"
        size="large"
        siblingCount={isMobile ? 0 : 1} // モバイルでは隣接ページを減らす
        sx={{
          flexWrap: 'wrap',
          justifyContent: 'center',
          '& .MuiPaginationItem-root': {
            color: resolvedTheme === 'light' ? '#818cf8' : 'white',
            minWidth: isMobile ? 32 : 40, // モバイルでは少しコンパクトに
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor:
              resolvedTheme === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
          },
        }}
      />
    </Stack>
  );
};

export default PaginationComponent;

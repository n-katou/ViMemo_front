import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PaginationComponentProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({ count, page, onChange }) => {
  return (
    <Stack spacing={2} className="mt-8">
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        variant="outlined"
        shape="rounded"
        color="primary"
        size="large"
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'white',
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
          },
        }}
      />
    </Stack>
  );
};

export default PaginationComponent;

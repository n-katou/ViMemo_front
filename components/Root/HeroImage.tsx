import React from 'react';
import Image from 'next/image';
import { Box } from '@mui/material';
import pinterestBoardPhoto from '../../public/pinterest_board_photo.png'

const HeroImage: React.FC = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      mb={4}
      sx={{
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        marginTop: '20px',
        zIndex: 1,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Box
        className="gradient-overlay relative w-full h-auto overflow-hidden"
        sx={{
          width: '100%',
          height: 'auto',
        }}
      >
        <Image
          src={pinterestBoardPhoto}
          alt="Pinterest Board"
          layout="responsive"
          width={1500}
          height={500}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>
    </Box>
  );
};

export default HeroImage;

"use client";
import React from 'react';

import useOAuthCallback from '../hooks/useOAuthCallback';
const MyPage = () => {
  useOAuthCallback();
  return (
    <div>Loading...</div>
  );
};

export default MyPage;

"use client";
import React from 'react';

import useOAuthCallback from '../hooks/useOAuthCallback';
const MyPage = () => {
  useOAuthCallback();
  return (
    <div>ルートページ</div>
  );
};

export default MyPage;

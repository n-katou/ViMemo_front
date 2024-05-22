"use client";
import React from 'react';

import useOAuthCallback from '../../hooks/useOAuthCallback';
const ReturnPage = () => {
  useOAuthCallback();
  return (
    <div>ルートページ</div>
  );
};

export default ReturnPage;

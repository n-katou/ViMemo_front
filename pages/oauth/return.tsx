"use client";
import React from 'react';
import useOAuthCallback from '../../hooks/useOAuthCallback';
import LoadingSpinner from '../../components/LoadingSpinner';

const ReturnPage = () => {
  useOAuthCallback();
  return (
    <div className="flex justify-center items-center h-screen">
      <LoadingSpinner loading={true} />
      <p>認証処理中...</p>
    </div>
  );
};

export default ReturnPage;

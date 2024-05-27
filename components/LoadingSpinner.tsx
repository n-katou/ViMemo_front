// components/LoadingSpinner.tsx
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

interface LoadingSpinnerProps {
  loading: boolean;
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loading, size = 50, color = "#123abc" }) => {
  if (!loading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="text-center">
        <ClipLoader size={size} color={color} loading={loading} />
        <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

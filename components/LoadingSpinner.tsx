// components/LoadingSpinner.tsx
import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

interface LoadingSpinnerProps {
  loading: boolean;
  size?: number;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loading, size = 50, color = "#123abc" }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ClipLoader size={size} color={color} loading={loading} />
    </div>
  );
};

export default LoadingSpinner;

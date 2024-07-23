import React from 'react';
import styles from '../../../styles/mypage/dashboard/CustomSpinner.module.css';

interface CustomSpinnerProps {
  size?: number;
  bgColor?: string;
}

const CustomSpinner: React.FC<CustomSpinnerProps> = ({ size = 300, bgColor = 'rgba(255, 255, 255, 0.5)' }) => {
  const spinnerStyle = {
    width: size,
    height: size,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: bgColor, zIndex: 50 }}>
      <div className="text-center">
        <div className={styles.spinner} style={spinnerStyle}></div>
        <p className="mt-4 text-white text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default CustomSpinner;

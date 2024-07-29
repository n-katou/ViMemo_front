import React from 'react';
import styles from '../../../styles/mypage/dashboard/CustomSpinner.module.css';

interface CustomSpinnerProps {
  size?: number;
  bgColor?: string;
  text?: string;
}

const CustomSpinner: React.FC<CustomSpinnerProps> = ({ size = 300, bgColor = 'rgba(255, 255, 255, 0.5)', text = 'シャッフル中...' }) => {
  const spinnerStyle = {
    width: size,
    height: size,
  };

  const textStyle = {
    color: '#fff',
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: bgColor, zIndex: 50 }}>
      <div className="text-center">
        <div className={styles.spinner} style={spinnerStyle}></div>
        <p className="mt-4 text-lg font-semibold" style={textStyle}>{text}</p>
      </div>
    </div>
  );
};

export default CustomSpinner;

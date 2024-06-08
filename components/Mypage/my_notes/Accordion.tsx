import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTheme } from 'next-themes';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  const bgClass = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black';
  const contentBgClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center text-left px-4 py-2 rounded-md focus:outline-none ${bgClass}`}
      >
        <span>{title}</span>
        <span>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </button>
      {isOpen && (
        <div className={`p-4 rounded-md mt-2 ${contentBgClass}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;

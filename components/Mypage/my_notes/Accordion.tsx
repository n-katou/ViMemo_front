import React, { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none"
      >
        {title}
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-700 rounded-md mt-2">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;

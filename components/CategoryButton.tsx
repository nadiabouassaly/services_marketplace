import { useState } from 'react';
import { FaSlidersH, FaBook, FaUser, FaBroom, FaDog, FaBaby, FaCar } from 'react-icons/fa';

type CategoryButtonProps = {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
};

function CategoryButton({ icon, label, selected, onClick }: CategoryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex items-center w-full px-3 py-2 rounded-md text-xs
        transition-colors duration-200
        ${selected
          ? 'bg-blue-50 text-[#0e56c9]'
          : 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
      `}
      style={{ outline: 'none' }}
    >
      <span className={`mr-2 text-sm transition-colors duration-200 ${selected ? 'text-[#0e56c9]' : 'text-gray-400'}`}>
        {icon}
      </span>
      {label}
    </button>
  );
}

const categories = [
  { label: 'Tutoring', icon: <FaBook /> },
  { label: 'Elderly Care', icon: <FaUser /> },
  { label: 'Home Maintenance', icon: <FaBroom /> },
  { label: 'Pet Care', icon: <FaDog /> },
  { label: 'Babysitting', icon: <FaBaby/>},
  { label: 'Transportation', icon: <FaCar/>},
];
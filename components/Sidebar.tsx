"use client";

import { FaSlidersH, FaBook, FaUser, FaSoap, FaDog, FaBroom, FaBaby, FaCar } from 'react-icons/fa';
import { useState, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation'; //comment
const UserContext = createContext<string[]>([]); ; 

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
        transition-colors duration-300
        ${selected
          ? 'bg-blue-50 text-[#0e56c9]'
          : 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
      `}
      style={{ outline: 'none' }}
    >
      <span className={`mr-2 text-sm transition-colors duration-300 ${selected ? 'text-[#0e56c9]' : 'text-gray-400'}`}>
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

export default function Sidebar() {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter(); 

  const toggleFilter = (label: string) => {
    const updated = selected.includes(label)
      ? selected.filter(l => l !== label)
      : [...selected, label];

    setSelected(updated);
    router.push(`?filters=${updated.join(",")}`);
  };

  return (
    <aside className="w-64 bg-white">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <FaSlidersH className="mr-2 text-[#0e56c9]" />
        Filters
      </h2>

      <div className="border-b border-gray-200 mt-0 mb-5"></div>

      {/* Category Section */}
      <div className="mb-2 text-base font-semibold text-gray-700">Category</div>
      <div className="flex flex-col gap-2 mb-6">
        {categories.map(cat => (
          <CategoryButton
            key={cat.label}
            icon={cat.icon}
            label={cat.label}
            selected={selected.includes(cat.label)}
            onClick={() => toggleFilter(cat.label)}
          />
        )
        
        )}
      </div>

      <div className="border-b border-gray-200 mt-0 mb-5"></div>

      {/* Price Range Section */}
      <div className="mb-2 text-base font-semibold text-gray-700">Price Range</div>
      <input
        type="range"
        min={0}
        max={100}
        className="w-full accent-blue-600"
      />
    </aside>

  );
};


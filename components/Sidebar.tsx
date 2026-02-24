import { FaSlidersH } from 'react-icons/fa';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white">
      <h2 className="text-lg font-bold mb-4 flex items-center">
        <FaSlidersH className="mr-2 text-[#1166f0]" />
        Filter
      </h2>
      
      <div className="border-b border-gray-200 mt-0 mb-5"></div>

      <ul className="space-y-2">
        <li className="cursor-pointer hover:text-blue-600">Filter 1</li>
        <li className="cursor-pointer hover:text-blue-600">Filter 2</li>
        <li className="cursor-pointer hover:text-blue-600">Filter 3</li>
      </ul>
    </aside>
  );
}
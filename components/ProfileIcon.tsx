import { FaUser } from 'react-icons/fa';

export default function ProfileIcon() {
  return (
    <div className="bg-gray-200 rounded-full p-2.5 cursor-pointer hover:bg-gray-300 transition-colors duration-300 ease-in-out">
      <FaUser className="text-gray-400" />
    </div>
  );
}
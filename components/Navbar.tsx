import Logo from './Logo';
import NavbarButton from './NavbarButton';
import ProfileIcon from './ProfileIcon';
import { FaSearch } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />

        {/* Center Search bar */}
        <div className="flex-1 mx-6 relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search Services"
            className="w-full pl-11 pr-6 py-2 rounded-md bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0a74ff]"
          />
        </div>

        <div className="flex items-center space-x-4">
          <ProfileIcon />
          <NavbarButton>+ Post a Service</NavbarButton>
        </div>
      </div>
    </nav>
  );
}
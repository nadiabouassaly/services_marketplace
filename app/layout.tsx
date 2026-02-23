import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Services Marketplace',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Sidebar</h2>
          <ul>

          </ul>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <nav className="bg-white shadow p-4 flex items-center justify-between">
            <div className="text-2xl font-bold">PeerPoint</div>

            <ul className="flex space-x-6">
              <li>About</li>
              <li>Profile</li>
              <li>+ Post a Service</li>
            </ul>
          </nav>

          {/* Page content */}
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}

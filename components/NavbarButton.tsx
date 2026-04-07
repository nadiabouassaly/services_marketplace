"use client"

import { ReactNode } from 'react';

type NavbarButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  className?: string;
};

export default function NavbarButton({ children, onClick, icon, className = '' }: NavbarButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#0a74ff] text-white px-4 py-2 rounded-md hover:bg-[#1166f0] transition-colors duration-300 ease-in-out flex items-center ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
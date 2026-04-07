"use client"
type ServicesHeaderProps = {
    count: number;
  };
  
  export default function ServicesHeader({ count }: ServicesHeaderProps) {
    return (
      <div className="text-sm mb-4">
        <span className="text-gray-700">{count}</span>
        <span className="text-gray-500"> {count === 1 ? 'service available' : 'services available'}</span>
      </div>
    );
  }
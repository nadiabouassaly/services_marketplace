"use client";
//
import { FaBook, FaUser, FaBroom, FaDog, FaBaby, FaCar } from 'react-icons/fa';
import { useRouter } from "next/navigation";

type CardProps = {
  name: string;
  id : string;
  description: string;
  price: number;
  category: string; // category prop
};

// Map category to icon
const categoryIcons: Record<string, React.ReactNode> = {
  'tutoring': <FaBook />,
  'elderly care': <FaUser />,
  'home maintenance': <FaBroom />,
  'pet care': <FaDog />,
  'babysitting': <FaBaby />,
  'transportation': <FaCar />,
};

export default function Card({ id, name, description, price, category }: CardProps) {
  const icon = categoryIcons[category?.toLowerCase()];
  const router = useRouter();
  return (
    <div onClick={() => router.push(`/services/${id}`)} className="bg-white rounded-lg shadow-sm border border-gray-300 hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      {/* Top banner */}
      <div className="w-full h-32 bg-blue-100 flex items-center justify-center">
        <div className="w-full h-32 bg-blue-100 flex items-center justify-center text-blue-600 text-4xl opacity-40">
          {icon}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-md font-bold mb-2">{name}</h3>
        <p className="text-gray-700 text-sm leading-snug">{description}</p>
        <p className="mt-auto text-right text-[#0a74ff] font-bold">${price}</p>
      </div>
    </div>
  );
}

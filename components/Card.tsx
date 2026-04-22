"use client";
import { FaBook, FaUser, FaBroom, FaDog, FaBaby, FaCar } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getReviewsForService } from "@/lib/reviewsApi";
import { deleteServiceByID } from '@/lib/services';

type CardProps = {
  name: string;
  id : string;
  description: string;
  price: number;
  category: string;
  editing: boolean 
  image?: string | null; 
};


// Map category to icon.
const categoryIcons: Record<string, React.ReactNode> = {
  'tutoring': <FaBook />,
  'elderly care': <FaUser />,
  'home maintenance': <FaBroom />,
  'pet care': <FaDog />,
  'babysitting': <FaBaby />,
  'transportation': <FaCar />,
};

export default function Card({ id, name, description, price, category, editing, image }: CardProps) {
  const icon = categoryIcons[category?.toLowerCase()];
  const router = useRouter();

  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [deleted, setDeleted] = useState(false) ;

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await getReviewsForService(id);
        setAverage(res.averageRating);
        setCount(res.count);
      } catch (e) {
        console.error(e);
      }
    }
    fetchReviews();
  }, [id]);

  const onClick = ()=>{

    if(editing == false)
    router.push(`/services/${id}`)
    }

    const deleteService= async (service_id: string, name: string)=>{

      const confirmed = window.confirm("Are you sure you want to delete \"" + name + "\" service? This action cannot be undone") ;

      if(confirmed){
      await deleteServiceByID(service_id) 
      setDeleted(true) ;
      }

      else
      return ;
    }

  const style = {
    opacity: deleted? 0.5: ""
  }

  return (
    <div style={style} className="flex flex-col h-full">
    <div onClick={onClick} className="bg-white rounded-lg shadow-sm border border-gray-300 hover:shadow-md transition-shadow flex flex-col overflow-hidden flex-1">
      {/* Top banner */}
      <div className="w-full h-32 bg-blue-100 flex items-center justify-center">
        <div className="w-full h-32 bg-blue-100 flex items-center justify-center overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-blue-600 text-4xl opacity-40">
              {icon}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-md font-bold mb-2">{name}</h3>
        <p className="text-gray-700 text-sm leading-snug">{description}</p>
        <div className="mt-auto flex justify-between items-center">
          {/* LEFT: Reviews */}
          {count === 0 ? (
            <p className="text-xs text-gray-400">No reviews</p>
          ) : (
            <div className="flex items-center gap-1 text-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= Math.floor(average) ? "text-[#0a74ff]" : "text-gray-300"}
                >
                  ★
                </span>
              ))}
              <span className="text-xs text-gray-600 ml-1">
                {average.toFixed(1)}
              </span>
            </div>
          )}

          {/* RIGHT: Price */}
          <p className="text-[#0a74ff] font-bold">${price}</p>
        </div>
      </div>

    </div>
    {editing && deleted == false && <button style={{marginLeft:"25px", marginTop:"6px", color:"red"}} onClick={()=>deleteService(id, name)}>delete</button>}
    </div>
  );
}

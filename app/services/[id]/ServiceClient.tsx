"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/db"; 
import { timeAgo } from "@/lib/services";
import styles from "./page.module.css";
import ImageCarousel from "@/components/ImageCarousel";
import ReviewModal from "@/components/ReviewModal";
import {FaLocationArrow, FaBook, FaUser, FaBroom, FaDog, FaBaby, FaCar, FaBusinessTime } from 'react-icons/fa';

const categoryIcons: Record<string, React.ReactNode> = {
  'Tutoring': <FaBook />,
  'Elderly Care': <FaUser />,
  'Home Maintenance': <FaBroom />,
  'Pet Care': <FaDog />,
  'Babysitting': <FaBaby />,
  'Transportation': <FaCar />,
};

export default function ServiceClient({ service, images }: { service: any; images: any }) {
    const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }: { data: { user: { id: string } | null } }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  if (!service) return <p className={styles.notFound}>Service Not Found :(</p>;

  return (
    <main className="min-h-screen bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-4xl mx-auto">

          {/* Title + Provider */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{service.name}</h1>
              <p className="text-sm text-gray-400 mt-1">Posted {timeAgo(service.created_at)}</p>
            </div>
            <div className={styles.avatar}><FaUser /></div>
          </div>

          {images ? <ImageCarousel images={images} /> : null}

          <div className="flex items-center gap-6 mt-3 mb-2 text-gray-600">
            <span className="text-lg font-semibold text-blue-600">${service.price}</span>
            <span className="flex items-center gap-2"><FaLocationArrow className="text-blue-700" />{service.location}</span>
            <span className="flex items-center gap-2">
              <span className="text-blue-700 text-xl">{categoryIcons[service.category]}</span>
              <span className="text-base">{service.category}</span>
            </span>
            {service.availability ? (
              <span className="flex items-center gap-2"><FaBusinessTime className="text-blue-700" />{service.availability}</span>
            ) : ""}
          </div>

          <p className="text-lg text-black leading-relaxed mb-6">{service.description}</p>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 px-4 py-2 rounded-md border border-[#0a74ff] text-[#0a74ff] bg-white hover:bg-blue-50 transition-colors duration-300 ease-in-out">
              Review
            </button>
            <button className="flex-1 px-4 py-2 rounded-md bg-[#0a74ff] text-white hover:bg-[#1166f0] transition-colors duration-300 ease-in-out">
              Request Service
            </button>
          </div>

        </div>
      </div>

      {showModal && (
  <ReviewModal
    serviceId={service.services_id} // this must be a real UUID from your DB
    userId={null}                   // no login yet, safe for nullable column
    onClose={() => setShowModal(false)}
  />
      )}

    </main>
  );
}
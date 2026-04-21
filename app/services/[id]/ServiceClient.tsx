"use client";
import { useState, useEffect } from "react";
import { timeAgo } from "@/lib/services";
import styles from "./page.module.css";
import ImageCarousel from "@/components/ImageCarousel";
import ReviewModal from "@/components/ReviewModal";
import { getReviewsForService } from "@/lib/reviewsApi";
import { Review } from "@/types/review";
import {FaLocationArrow, FaBook, FaUser, FaBroom, FaDog, FaBaby, FaCar, FaBusinessTime } from 'react-icons/fa';
import ProfileIcon from "@/components/ProfileIcon" ;
import { useProfileData } from "@/hooks/useProfileData";
import AuthGate from "@/app/auth/components/AuthGate";
import { supabase } from "@/app/auth/lib/supabase";
import RequestModal from "@/components/RequestModal";
import { isComplete } from "@/lib/requestsAPI";

const categoryIcons: Record<string, React.ReactNode> = {
  'Tutoring': <FaBook />,
  'Elderly Care': <FaUser />,
  'Home Maintenance': <FaBroom />,
  'Pet Care': <FaDog />,
  'Babysitting': <FaBaby />,
  'Transportation': <FaCar />,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ServiceClient({ service, images }: { service: any; images: any }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [statusValue, setStatusValue] = useState<"loading" | "completed" | "not_completed">("loading");
  const {profile, signedIn, loading} = useProfileData("") ;

  useEffect(() => {

    if (loading) return;
    
    async function fetchReviews() {
      try {
        const res = await getReviewsForService(service.services_id);
        setAverage(res.averageRating);
        setCount(res.count);
        setReviews(res.reviews);
      } catch (e) {
        console.error(e);
      }
    }
    if (service?.services_id) fetchReviews();

    async function getStatus() {
      const data = await isComplete(service.services_id, profile?.userprofile_id || "");

      if (data?.status === "completed") {
        setStatusValue("completed");
      } else {
        setStatusValue("not_completed");
      }
    }

    if (profile?.userprofile_id) {
    getStatus();
    } else {
    // No user logged in, just stop loading
    setStatusValue("not_completed");
    }

  }, [loading, profile?.userprofile_id, service.services_id]);

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
            {profile && service.userprofile_id != profile?.userprofile_id && <ProfileIcon id={service.userprofile_id}/>}
          </div>

          {images ? <ImageCarousel images={images} /> : null}

          <div className="flex items-center gap-6 mt-3 mb-2 text-gray-600">
            <span className="text-lg font-semibold text-blue-600">${service.price}</span>

            {count === 0 ? (
              <span className="text-xs text-gray-400">No reviews</span>
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
                <span className="text-s text-gray-600 ml-1">
                  {average.toFixed(1)} ({count})
                </span>
              </div>
            )}

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

           {profile && profile.userprofile_id != service.userprofile_id && statusValue != "loading" && !loading && <div className="flex gap-3 mt-6">
            
            {statusValue == "completed" && <button
              onClick={() => setShowReviewModal(true)}
              className="flex-1 px-4 py-2 rounded-md border border-[#0a74ff] text-[#0a74ff] bg-white hover:bg-blue-50 transition-colors duration-300 ease-in-out">
              Review
            </button>}

            {<button 
              onClick={() => setShowRequestModal(true)}
              className="flex-1 px-4 py-2 rounded-md bg-[#0a74ff] text-white hover:bg-[#1166f0] transition-colors duration-300 ease-in-out">
              Request Service
            </button>}

          </div>}

          {/* ── Reviews section ── */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>

            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400">No reviews yet. Be the first to leave one!</p>
            ) : (
              <ul className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <li key={review.id} className="border border-gray-200 rounded-lg p-4">
                    
                    {/* Reviewer info */}
                    <ReviewerHeader userprofileId={review.user_id} />

                    {/* Stars row */}
                    <div className="flex items-center gap-1 mb-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= review.rating ? "text-[#0a74ff]" : "text-gray-300"}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Comment */}
                    {review.comment && (
                      <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-400 mt-2">{timeAgo(review.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {showReviewModal && signedIn == false && <AuthGate closeOption={true}/>}
      
      {showReviewModal && signedIn && (
        <ReviewModal
          serviceId={service.services_id}
          userId={profile?.userprofile_id ?? null}
          onClose={() => setShowReviewModal(false)}
        />
      )} 
  
      {showRequestModal && signedIn && (
        <RequestModal
          service = {service}
          currentUser={profile?.userprofile_id ?? ""}
          onClose={() => setShowRequestModal(false)}
        />
      )}

      {showRequestModal && signedIn == false && <AuthGate closeOption={true}/>}

    </main>
  );

  function ReviewerHeader({ userprofileId }: { userprofileId: string | null}) {
    const [name, setName] = useState<string | null>(null);
    const [pictureUrl, setPictureUrl] = useState<string | null>(null);

    useEffect(() => {
      const fetch = async () => {
        const { data, error } = await supabase
          .from("userprofile")
          .select("firstname, lastname, profilePicture")
          .eq("userprofile_id", userprofileId)
          .single();

        if (!error && data) {
          setName(`${data.firstname} ${data.lastname}`);
          setPictureUrl(data.profilePicture ?? null);
        }
      };
      if (userprofileId) fetch();
    }, [userprofileId]);

    return (
      <div className="flex items-center gap-2 mb-1">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
          {pictureUrl ? (
            <img src={pictureUrl} className="w-full h-full object-cover" />
          ) : (
            <FaUser className="text-gray-400 text-sm" />
          )}
        </div>

        {/* Name */}
        <span className="text-sm font-semibold text-gray-800">
          {name ?? "Anonymous"}
        </span>
      </div>
    );
  }

}

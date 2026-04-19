"use client";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { addReview } from "@/lib/reviewsApi";

type ReviewModalProps = {
  serviceId: string;
  userId: string | null;
  onClose: () => void;
};

export default function ReviewModal({ serviceId, userId, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSave = async () => {
    try {
        await addReview({ service_id: serviceId, user_id: userId, rating, comment: comment || null });
      onClose();
      alert("Review saved!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.error("Supabase error:", e);
        alert(`Failed to save review: ${e.message || JSON.stringify(e)}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
      <div className="bg-white rounded-lg p-6 w-96 flex flex-col gap-4">
        <h2 className="text-xl font-bold">Add a Review</h2>

        {/* Stars */}
        <div className="flex gap-1 text-3xl">
          {[1, 2, 3, 4, 5].map((i) => (
            <FaStar
              key={i}
              className={`cursor-pointer transition-colors duration-200 ${
                i <= (hover || rating) ? "text-blue-600" : "text-gray-300"
              }`}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(i)}
            />
          ))}
        </div>

        {/* Optional comment */}
        <textarea
          className="border border-gray-300 rounded-md p-2 text-sm resize-none"
          placeholder="You can write a review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="flex-1 px-4 py-2 rounded-md border border-[#0a74ff] text-[#0a74ff] bg-white hover:bg-blue-50 transition-colors duration-300 ease-in-out"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-md bg-[#0a74ff] text-white hover:bg-[#1166f0] transition-colors duration-300 ease-in-out"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
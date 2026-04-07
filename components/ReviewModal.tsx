"use client";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { addReview } from "@/lib/reviewsApi";

type ReviewModalProps = {
  serviceId: string;
  userId: string;
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
    } catch (e) {
      console.error(e);
      alert("Failed to save review.");
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
          className="border border-gray-300 rounded-md p-2 text-sm"
          placeholder="You can write a review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-3 py-1 rounded-md border border-gray-400 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
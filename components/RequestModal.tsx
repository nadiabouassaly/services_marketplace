"use client";

import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {createRequest} from "@/lib/requestsAPI";
import {UserService, Profile} from '@/types/userService'
import {supabase} from "@/lib/db"; 

export default function RequestServiceModal({ service, currentUser, onClose }: { service: any; currentUser: { id: string | null }; onClose: () => void }) {
  const [modalNum, setModalNum] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
  message: "",
  budget: "",
  duration_requested: "",
  communication_method : "",
});
  const providerName = service?.profile?.name;
const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));
  const router = useRouter();

const handleSubmit = async () => {
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;

  if (!userId) {
    alert("You need to be logged in to request a service.");
    return;
  }

  const { error } = await createRequest({ service, currentUser: { id: userId }, form });
  if (error) {
    alert(JSON.stringify(error));
  } else {
    setModalNum(2);
  }
};
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]"
      onClick={onClose}
    >
      {/* Modal box */}
      <div
        className="w-full max-w-md bg-white rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        

        {modalNum === 1 && (
        <div>
            <div className="flex justify-between items-start mb-5">
          <h2 className="text-base font-semibold">Request this service</h2>
        </div>
        <div>
            <h2 className="font-semibold text-sm">What do you need?</h2>
         <textarea
         value={form.message}
        onChange={(e) => update("message", e.target.value)}
          className="mt-1 border border-gray-300 rounded-md p-2 text-sm w-100 h-32"
          placeholder="Describe your project, goals, and any specific requirements you may need..."
        />
        </div>
        <div className = "mt-4 flex gap-3">
        <div className="flex-1">
            <h2 className="font-semibold text-sm">Your Budget (in USD) </h2>
            <textarea 
            value={form.budget}
            onChange={(e) => update("budget", e.target.value)}
            className=" mt-1 border border-gray-300 rounded-md p-1 resize-none text-sm w-48 h-10"
            placeholder="e.g. $15, $20..."></textarea>
        </div>
        <div className="flex-1">
            <h2 className="font-semibold text-sm">Timeline </h2>
            <textarea
            value={form.duration_requested}
            onChange={(e) => update("duration_requested", e.target.value)} 
            className=" mt-1 border border-gray-300 rounded-md p-1 resize-none text-sm w-49 h-10"
            placeholder="e.g. 1 week, 1 month..."></textarea>
        </div>
        </div>
        
          <div>
            <h2 className= "mt-4 text-sm font-semibold">Select your preferred communication method</h2>
          <select
        value={form.communication_method}
        onChange={(e) => update("communication_method", e.target.value)}
        className="mt-1 border border-gray-300 rounded-md p-2 text-sm"
      >
        <option value="">Select...</option>
        <option value="WhatsApp">WhatsApp</option>
        <option value="Email">Email</option>
      </select>
          </div>
        <div className="flex gap-3 mt-2">
          <button
            className="flex-1 px-4 py-2 rounded-md border border-[#0a74ff] text-[#0a74ff] bg-white hover:bg-blue-50 transition-colors duration-300 ease-in-out"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2 rounded-md bg-[#0a74ff] text-white hover:bg-[#1166f0] transition-colors duration-300 ease-in-out"
            onClick={handleSubmit}
          >
          Send Request
          </button>
        </div>
        </div>
    )}
    {modalNum === 2 && (
  <div className="relative p-6 text-center">
    
    {/* Close button */}
    <button
      onClick={onClose}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
    >
      ✕
    </button>

    <div className="flex justify-center mb-2">
      <FaCheck className="text-blue-500 text-3xl" />
    </div>

    <h1 className="text-lg font-semibold">
      Request Sent!
    </h1>

    <p className="mt-2 text-sm text-gray-600">
      {providerName
    ? `${providerName} will review your request and get back to you soon.`
    : "Service provider will review your request and get back to you soon."}
    </p>

    {/* Buttons */}
    <div className="flex gap-3 mt-6">
      <button
        className="flex-1 px-3 py-2 rounded-md bg-[#0a74ff] text-white hover:bg-[#1166f0] transition"
        onClick={() => router.push("/")}
      >
        Browse More Services
      </button>

      <button
        className="flex-1 px-3 py-2 rounded-md border border-[#0a74ff] text-[#0a74ff] bg-white hover:bg-blue-50 transition"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
    </div>
  );
}

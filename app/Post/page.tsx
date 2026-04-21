"use client";

import { FormEvent, Suspense, useState } from "react";
import { createService } from "@/lib/services";
import { supabase } from "@/lib/db";
import { uploadImages, addImages } from "@/lib/images";
import { useProfileData } from "@/hooks/useProfileData";
import AuthGate from "../auth/components/AuthGate";

const categories = [
  "Tutoring",
  "Babysitting",
  "Elderly Care",
  "Home Maintenance",
  "Pet Care",
  "Transportation",
  "Other",
];

export default function Post() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  
  const {profile, signedIn} = useProfileData("") ;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!name.trim() || !description.trim() || !price || !location.trim() || !category) {
      setStatus("Please fill in all required fields.");
      return;
    }

    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setStatus("Price must be a non-negative number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;

      if (!userId) {
        setStatus("You must be logged in to create a service.");
        return;
      }

      console.log("before createService");

      const service = await createService({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        location: location.trim(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        category: category as any,
        availability: "",
        userprofile_id: profile?.userprofile_id
      });

      console.log("after createService");


      if (images && service?.services_id && userId) {
        const urls = await uploadImages(images);
        await addImages(service.services_id, urls, userId);
      }

      setStatus("Service created successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setLocation("");
      setCategory(categories[0]);
    }catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create service.";
    setStatus(message);
    } finally {
    setIsSubmitting(false);
    } 
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    {signedIn == false && <AuthGate closeOption={false}/>}
    {signedIn && <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Create Service</h1>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Title*</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImages(e.target.files)}
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Description*</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Price*</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Location*</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            />
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            <span className="font-medium">Category*</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none"
            >
              <option value="" disabled hidden className="text-gray-400">
                Select a category
              </option>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-blue-600 text-white py-2 px-4 font-semibold transition hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Post Service"}
          </button>
        </form>

        {status && (
          <p className={`mt-4 text-sm ${status.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}
      </div>
    </main>}
    </Suspense>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { createService } from "@/lib/services";

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
  const [category, setCategory] = useState(categories[0]);
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createService({
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        location: location.trim(),
        category: category as
          | "Tutoring"
          | "Babysitting"
          | "Elderly Care"
          | "Home Maintenance"
          | "Pet Care"
          | "Transportation"
          | "Other",
      });
      setStatus("Service created successfully!");
      setName("");
      setDescription("");
      setPrice("");
      setLocation("");
      setCategory(categories[0]);
    } catch (error: any) {
      setStatus(error?.message || "Failed to create service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
            {isSubmitting ? "Saving..." : "Create Service"}
          </button>
        </form>

        {status && (
          <p className={`mt-4 text-sm ${status.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}
      </div>
    </main>
  );
}


import { supabase } from '@/lib/db';
import { Review, ReviewResponse } from '@/types/review';

export async function addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select('*')
    .single();

  if (error) throw error;
  return data as Review;
}

export async function getReviewsForService(serviceId: string): Promise<ReviewResponse> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('serviceId', serviceId)
    .order('createdAt', { ascending: false });

  if (error) throw error;

  const reviews = data as Review[];
  const count = reviews.length;
  const averageRating = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return { reviews, averageRating, count };
}

export async function getAverageRating(serviceId: string): Promise<number> {
  const { data, error } = await supabase
    .from('reviews')
    .select('rating')
    .eq('serviceId', serviceId);

  if (error) throw error;

  const reviews = data as { rating: number }[];
  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return Math.round(average * 10) / 10;
}
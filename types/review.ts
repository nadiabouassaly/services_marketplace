export type Review = {
  id: string;
  created_at: string;
  user_id: string | null;
  service_id: string;
  comment: string | null;
  rating: number;
};

export type ReviewResponse = {
  reviews: Review[];
  averageRating: number;
  count: number;
};
export type Review = {
  id: string;
  serviceId: string;
  userId: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

export type ReviewResponse = {
  reviews: Review[];
  averageRating: number;
  count: number;
};
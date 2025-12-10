"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Star, User, Calendar } from "lucide-react";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);

    // Fetch reviews from supabase
    const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading reviews:", error);
      setLoading(false);
      return;
    }

    setReviews(data || []);
    setLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Reviews</h1>

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews found.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <Card key={rev.id} className="shadow-sm border">
              <CardContent className="p-4">
                {/* Row 1: User + rating */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold">{rev.tenant_name}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="mt-3 text-gray-700">{rev.comment}</p>

                {/* Date */}
                <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(rev.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

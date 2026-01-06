import { useEffect, useState, useCallback } from "react";
import { addReview, getReviews } from "@/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, User } from "lucide-react";
import { Card } from "@/components/ui/card";

const ReviewsSection = ({ restaurantId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ message: "", rating: 5 });
  const [loading, setLoading] = useState(false);

  // ✅ FIX 1: Wrap in useCallback so it's stable
  const fetchReviews = useCallback(async () => {
    try {
      const res = await getReviews(restaurantId);
      setReviews(res.data);
    } catch (error) {
      // ✅ FIX 2: Use the error variable
      console.error("Failed to fetch reviews:", error);
    }
  }, [restaurantId]);

  // ✅ FIX 3: Add dependency
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async () => {
    if (!newReview.message) return alert("Please write a message!");
    setLoading(true);
    try {
      await addReview(restaurantId, newReview);
      setNewReview({ message: "", rating: 5 });
      fetchReviews();
    } catch (error) {
      // ✅ FIX 4: Use the error variable
      console.error("Submit failed:", error);
      alert("Failed to submit review. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Star className="fill-yellow-500 text-yellow-500" /> Reviews (
        {reviews.length})
      </h2>

      {/* WRITE REVIEW FORM */}
      <Card className="bg-zinc-900 border-zinc-800 p-6 mb-8">
        <h3 className="font-bold mb-4">Write a Review</h3>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setNewReview({ ...newReview, rating: star })}
              className={`transition-transform hover:scale-110 ${
                star <= newReview.rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-zinc-600"
              }`}
            >
              <Star
                size={24}
                fill={star <= newReview.rating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
        <Textarea
          placeholder="How was the food?"
          value={newReview.message}
          onChange={(e) =>
            setNewReview({ ...newReview, message: e.target.value })
          }
          className="bg-zinc-950 border-zinc-800 mb-4"
        />
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? "Posting..." : "Post Review"}
        </Button>
      </Card>

      {/* REVIEW LIST */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-zinc-500 italic">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-zinc-800 pb-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-zinc-800 rounded-full flex items-center justify-center">
                    <User size={14} className="text-zinc-400" />
                  </div>
                  <span className="font-bold text-sm">
                    {review.user?.fullName || "Foodie User"}
                  </span>
                </div>
                <div className="flex text-yellow-500">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-zinc-300 text-sm">{review.message}</p>
              <p className="text-zinc-600 text-xs mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;

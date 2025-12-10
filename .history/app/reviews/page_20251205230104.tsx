"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, User, Calendar, Home, ThumbsUp, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

// --------------------
// Review Interface
// --------------------
interface Review {
  id: number
  tenant_name: string
  rating: number
  comment: string
  created_at: string
  owner_reply?: string | null   // NEW FIELD
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set())

  // Reply UI States
  const [openReplyBox, setOpenReplyBox] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")

  // --------------------
  // Fetch Reviews
  // --------------------
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)

      const { data } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false })

      setReviews(data || [])
      setLoading(false)
    }

    fetchReviews()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  )

  const handleLike = (reviewId: number) => {
    setLikedReviews((prev) => {
      const newSet = new Set(prev)
      newSet.has(reviewId) ? newSet.delete(reviewId) : newSet.add(reviewId)
      return newSet
    })
  }

  // --------------------
  // Open & Submit Reply
  // --------------------
  const toggleReplyBox = (id: number) => {
    setOpenReplyBox(openReplyBox === id ? null : id)
    setReplyText("") // Reset input
  }

  const submitReply = async (reviewId: number) => {
    if (!replyText.trim()) return

    // Send to Supabase
    await supabase
      .from("reviews")
      .update({ owner_reply: replyText })
      .eq("id", reviewId)

    // Update UI instantly
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, owner_reply: replyText } : r))
    )

    setOpenReplyBox(null)
    setReplyText("")
  }

  // --------------------
  // Loading State
  // --------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <Link href="/" className="inline-flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">RoomFinder</span>
            </Link>
          </div>

          <h1 className="text-2xl font-semibold mb-4">Property Reviews</h1>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-4xl">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Link href="/" className="inline-flex items-center">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">RoomFinder</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Property Reviews</h1>
          <p className="text-sm text-muted-foreground">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} from tenants
          </p>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="rounded-xl border bg-card shadow-sm">
              <CardContent className="p-6">
                
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                      <User className="h-5 w-5 text-violet-600" />
                    </div>
                    <span className="font-medium">{review.tenant_name}</span>
                  </div>
                  {renderStars(review.rating)}
                </div>

                {/* Comment */}
                <p className="mt-4 text-muted-foreground">{review.comment}</p>

                {/* Date + Buttons */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(review.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(review.id)}
                      className={likedReviews.has(review.id) ? "text-blue-500" : ""}
                    >
                      <ThumbsUp className="h-4 w-4" /> Like
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleReplyBox(review.id)}
                    >
                      <MessageCircle className="h-4 w-4" /> Reply
                    </Button>
                  </div>
                </div>

                {/* Owner Reply Display */}
                {review.owner_reply && (
                  <div className="mt-4 ml-12 border-l-2 pl-4 text-sm text-gray-700">
                    <strong>Owner Reply:</strong> {review.owner_reply}
                  </div>
                )}

                {/* Reply Input Box */}
                {openReplyBox === review.id && (
                  <div className="mt-4 ml-12">
                    <textarea
                      rows={2}
                      className="w-full border rounded-md p-2 text-sm"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />

                    <Button className="mt-2 bg-blue-600 text-white" size="sm" onClick={() => submitReply(review.id)}>
                      Send Reply
                    </Button>
                  </div>
                )}

              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

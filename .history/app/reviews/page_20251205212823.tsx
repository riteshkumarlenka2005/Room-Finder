"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, User, Calendar, Home, ThumbsUp, MessageCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
interface Review {
  id: number
  tenant_name: string
  rating: number
  comment: string
  created_at: string
}

// Mock data - replace with Supabase fetch when integration is added
const mockReviews: Review[] = [
  {
    id: 1,
    tenant_name: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely loved staying here! The property was spotless, modern, and had everything we needed. The host was incredibly responsive and helpful throughout our stay.",
    created_at: "2025-06-01T10:30:00Z",
  },
  {
    id: 2,
    tenant_name: "Michael Chen",
    rating: 4,
    comment:
      "Great location and comfortable space. Minor issue with the WiFi but the host resolved it quickly. Would definitely recommend to others.",
    created_at: "2025-05-28T14:15:00Z",
  },
  {
    id: 3,
    tenant_name: "Emily Rodriguez",
    rating: 5,
    comment:
      "Perfect for our family vacation! Kids loved the amenities and we appreciated the thoughtful touches like extra towels and a fully stocked kitchen.",
    created_at: "2025-05-20T09:45:00Z",
  },
  {
    id: 4,
    tenant_name: "David Thompson",
    rating: 3,
    comment:
      "Decent stay overall. The apartment was as described but could use some updates. Location was convenient for exploring the city.",
    created_at: "2025-05-15T16:20:00Z",
  },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [likedReviews, setLikedReviews] = useState<Set<number>>(new Set())

  useEffect(() => {
    // Simulate fetching from Supabase
    // Replace with: const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false })
    const fetchReviews = async () => {
      setLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))
      // Sort by created_at descending
      const sortedReviews = [...mockReviews].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      setReviews(sortedReviews)
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`}
          />
        ))}
      </div>
    )
  }

  const handleLike = (reviewId: number) => {
    setLikedReviews((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId)
      } else {
        newSet.add(reviewId)
      }
      return newSet
    })
  }

  const handleReply = (reviewId: number) => {
    // Placeholder - implement reply functionality as needed
    console.log("Reply to review:", reviewId)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
              <Link href="/" className="inline-flex items-center mb-4">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">RoomFinder</span>
          </Link>
            
          </div>
          <h1 className="mb-6 text-2xl font-semibold text-foreground">Property Reviews</h1>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
           
              <Link href="/" className="inline-flex items-center mb-4">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">RoomFinder</span>
          </Link>
           
          </div>
          <h1 className="mb-6 text-2xl font-semibold text-foreground">Property Reviews</h1>
          <p className="text-muted-foreground">No reviews found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
            <Link href="/" className="inline-flex items-center mb-4">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">RoomFinder</span>
          </Link>
        
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Property Reviews</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} from tenants
          </p>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="rounded-xl border bg-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100">
                      <User className="h-5 w-5 text-violet-600" />
                    </div>
                    <span className="font-medium text-foreground">{review.tenant_name}</span>
                  </div>
                  {renderStars(review.rating)}
                </div>

                <p className="mt-4 leading-relaxed text-muted-foreground">{review.comment}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(review.created_at)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(review.id)}
                      className={`gap-1.5 ${likedReviews.has(review.id) ? "text-blue-500" : "text-muted-foreground"}`}
                    >
                      <ThumbsUp className={`h-4 w-4 ${likedReviews.has(review.id) ? "fill-blue-500" : ""}`} />
                      <span>Like</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReply(review.id)}
                      className="gap-1.5 text-muted-foreground"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Reply</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

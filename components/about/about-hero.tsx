import { Users, Building2, Heart } from "lucide-react"

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white py-20 md:py-28">
      
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">

          {/* Tag */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
            <Users className="h-4 w-4 text-blue-600" />
            About RoomFinder
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Making Room Finding <span className="text-blue-600">Simple</span> for Students
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 md:text-xl">
            Students के लिए बनाया गया platform। We understand the challenges students face while searching for
            accommodations. That&apos;s why we created RoomFinder — your trusted companion in finding the perfect room.
          </p>

          {/* Info badges */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Verified Listings</span>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-blue-100 px-4 py-2">
              <Heart className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Student-Focused</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

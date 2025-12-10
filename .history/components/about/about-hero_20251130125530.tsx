import { Users, Building2, Heart } from "lucide-react"

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
            <Users className="h-4 w-4 text-primary" />
            About RoomFinder
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Making Room Finding <span className="text-primary">Simple</span> for Students
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Students के लिए बनाया गया platform। We understand the challenges students face while searching for
            accommodations. That&apos;s why we created RoomFinder - your trusted companion in finding the perfect room.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Verified Listings</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
              <Heart className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Student-Focused</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

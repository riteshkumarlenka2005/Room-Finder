import { Home, Users, MapPin, Star } from "lucide-react"

const stats = [
  {
    icon: Home,
    value: "5,000+",
    label: "Verified Rooms",
    description: "Safe and verified accommodations",
  },
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Students",
    description: "Students found their perfect room",
  },
  {
    icon: MapPin,
    value: "50+",
    label: "Cities Covered",
    description: "Across major cities in India",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Average Rating",
    description: "Based on student reviews",
  },
]

export function StatsSection() {
  return (
    <section className="border-y bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm font-semibold text-foreground">{stat.label}</div>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    <section className="bg-gray-50 border-y py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group flex flex-col items-center text-center transition-transform hover:-translate-y-1"
            >
              {/* Icon box */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl 
                              bg-blue-100 text-blue-600 
                              transition-all group-hover:bg-blue-600 group-hover:text-white">
                <stat.icon className="h-7 w-7" />
              </div>

              {/* Value */}
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>

              {/* Label */}
              <div className="text-sm font-semibold text-gray-800">{stat.label}</div>

              {/* Description */}
              <p className="mt-1 text-xs text-gray-600">{stat.description}</p>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}

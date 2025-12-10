import { Target, Eye, Rocket } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const missionItems = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To simplify the room-finding process for students across India by providing a trustworthy, user-friendly platform that connects students with verified property owners and essential domestic services.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To become India's most trusted student accommodation platform, ensuring every student finds a safe, affordable, and comfortable place to stay during their educational journey.",
  },
  {
    icon: Rocket,
    title: "Our Goal",
    description:
      "To expand our services to 100+ cities by 2025, helping over 1 million students find their perfect accommodation while maintaining the highest standards of verification and quality.",
  },
]

export function MissionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">What Drives Us</h2>
          <p className="text-gray-600">
            Our commitment to making student life easier through innovative solutions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {missionItems.map((item, index) => (
            <Card
              key={index}
              className="group border border-gray-200 transition-all hover:border-blue-500 hover:shadow-lg"
            >
              <CardContent className="p-6">
                
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600
                                transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-semibold text-gray-900">{item.title}</h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}

import { Shield, Heart, Zap, Users, CheckCircle2, Clock } from "lucide-react"

const values = [
  {
    icon: Shield,
    title: "Trust & Safety",
    description: "All properties and owners are thoroughly verified for your safety",
  },
  {
    icon: Heart,
    title: "Student-First",
    description: "Every feature is designed keeping student needs in mind",
  },
  {
    icon: Zap,
    title: "Quick & Easy",
    description: "Find your perfect room in minutes, not days",
  },
  {
    icon: Users,
    title: "Community",
    description: "Building a supportive community of students and landlords",
  },
  {
    icon: CheckCircle2,
    title: "Transparency",
    description: "No hidden charges, clear pricing, and honest listings",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our support team is always ready to help you",
  },
]

export function ValuesSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Our Core Values</h2>
          <p className="text-gray-600">The principles that guide everything we do at RoomFinder</p>
        </div>

        {/* Value Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="group flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-lg"
            >
              {/* Icon */}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg 
                           bg-blue-100 text-blue-600 
                           transition-colors group-hover:bg-blue-600 group-hover:text-white"
              >
                <value.icon className="h-5 w-5" />
              </div>

              {/* Text */}
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

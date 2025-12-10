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
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Our Core Values</h2>
          <p className="text-muted-foreground">The principles that guide everything we do at RoomFinder</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="group flex items-start gap-4 rounded-xl bg-background p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <value.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-foreground">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">What Drives Us</h2>
          <p className="text-muted-foreground">
            Our commitment to making student life easier through innovative solutions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {missionItems.map((item, index) => (
            <Card key={index} className="group border-2 transition-all hover:border-primary/50 hover:shadow-lg">
              <CardContent className="p-6 pt-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

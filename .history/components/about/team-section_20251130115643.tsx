import { Card, CardContent } from "@/components/ui/card"
import { Github, Linkedin, Mail } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const teamMembers = [
  {
    name: "Ritesh Kumar Lenka",
    role: "Full Stack Developer",
    bio: "Passionate about building scalable web applications and creating seamless user experiences.",
    avatar: "/professional-male-developer.png",
    initials: "RK",
    socials: {
      github: "#",
      linkedin: "#",
      email: "ritesh@roomfinder.com",
    },
  },
  {
    name: "Mayank Mishra",
    role: "Backend Developer",
    bio: "Specialized in database architecture and API development. Loves solving complex problems.",
    avatar: "/professional-male-software-engineer-portrait.jpg",
    initials: "MM",
    socials: {
      github: "#",
      linkedin: "#",
      email: "mayank@roomfinder.com",
    },
  },
  {
    name: "Somen Mishra",
    role: "Frontend Developer",
    bio: "Creating beautiful and responsive interfaces. Focused on user-centric design principles.",
    avatar: "/professional-male-frontend-developer-portrait.jpg",
    initials: "SM",
    socials: {
      github: "#",
      linkedin: "#",
      email: "somen@roomfinder.com",
    },
  },
]

export function TeamSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Meet Our Team</h2>
          <p className="text-muted-foreground">
            The passionate developers behind RoomFinder who are dedicated to making student accommodation easier
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-xl"
            >
              <CardContent className="p-6 pt-6">
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/10 transition-all group-hover:ring-primary/30">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="bg-primary text-lg text-primary-foreground">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 ring-2 ring-background" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="mb-1 text-lg font-semibold text-foreground">{member.name}</h3>
                  <p className="mb-3 text-sm font-medium text-primary">{member.role}</p>
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>

                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={member.socials.github}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      aria-label={`${member.name}'s GitHub`}
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a
                      href={member.socials.linkedin}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      aria-label={`${member.name}'s LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href={`mailto:${member.socials.email}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      aria-label={`Email ${member.name}`}
                    >
                      <Mail className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

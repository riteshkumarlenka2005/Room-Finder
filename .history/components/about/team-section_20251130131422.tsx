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
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Meet Our Team</h2>
          <p className="text-gray-600">
            The passionate developers behind RoomFinder dedicated to making student accommodation easier.
          </p>
        </div>

        {/* Team Cards */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {teamMembers.map((member, index) => (
            <Card
              key={index}
              className="group overflow-hidden border border-gray-200 transition-all hover:border-blue-500 hover:shadow-xl"
            >
              <CardContent className="p-6 pt-6">

                {/* Avatar */}
                <div className="mb-4 flex justify-center">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-blue-100 transition-all group-hover:ring-blue-300">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-blue-600 text-lg text-white">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>

                    {/* Online dot */}
                    <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 ring-2 ring-white" />
                  </div>
                </div>

                {/* Text Section */}
                <div className="text-center">
                  <h3 className="mb-1 text-lg font-semibold text-gray-900">{member.name}</h3>
                  <p className="mb-3 text-sm font-medium text-blue-600">{member.role}</p>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">{member.bio}</p>

                  {/* Social Icons */}
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={member.socials.github}
                      aria-label={`${member.name}'s GitHub`}
                      className="flex h-9 w-9 items-center justify-center rounded-full 
                                 bg-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <Github className="h-4 w-4" />
                    </a>

                    <a
                      href={member.socials.linkedin}
                      aria-label={`${member.name}'s LinkedIn`}
                      className="flex h-9 w-9 items-center justify-center rounded-full 
                                 bg-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>

                    <a
                      href={`mailto:${member.socials.email}`}
                      aria-label={`Email ${member.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full 
                                 bg-gray-200 text-gray-600 hover:bg-blue-600 hover:text-white transition"
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

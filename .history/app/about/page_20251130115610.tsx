import type { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { TeamSection } from "@/components/about/team-section"
import { MissionSection } from "@/components/about/mission-section"
import { StatsSection } from "@/components/about/stats-section"
import { ValuesSection } from "@/components/about/values-section"
import { ContactSection } from "@/components/about/contact-section"
import { AboutHeader } from "@/components/about/about-header"
import { AboutFooter } from "@/components/about/about-footer"

export const metadata: Metadata = {
  title: "About Us | RoomFinder - Find Your Perfect Room",
  description:
    "Learn about RoomFinder, the student-focused platform helping you find the perfect room, domestic helpers, and more. Meet our dedicated team.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <AboutHeader />
      <main>
        <AboutHero />
        <StatsSection />
        <MissionSection />
        <ValuesSection />
        <TeamSection />
        <ContactSection />
      </main>
      <AboutFooter />
    </div>
  )
}

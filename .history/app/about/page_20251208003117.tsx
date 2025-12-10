import type { Metadata } from "next"

import { AboutHero } from "@/components/about/about-hero"
import { TeamSection } from "@/components/about/team-section"
import { MissionSection } from "@/components/about/mission-section"
import { StatsSection } from "@/components/about/stats-section"
import { ValuesSection } from "@/components/about/values-section"
import { ContactSection } from "@/components/about/contact-section"
import Navbar from "@/components/navbar"   // <-- update path if different

export const metadata: Metadata = {
  title: "About Us | RoomFinder - Find Your Perfect Room",
  description:
    "Learn about RoomFinder, the student-focused platform helping you find the perfect room, domestic helpers, and more. Meet our dedicated team.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
      {/* Your actual project navbar */}
      <Navbar />

      <main className="mt-16">
        <AboutHero />
        <StatsSection />
        <MissionSection />
        <ValuesSection />
        <TeamSection />
        <ContactSection />
      </main>

      {/* Optional: Add your project footer if you have one */}
      {/* <Footer /> */}
    </div>
  )
}

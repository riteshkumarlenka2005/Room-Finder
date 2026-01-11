import Navbar from "@/components/navbar";
import { Users, Target, Heart, Home } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-black text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            For Students, By Students
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto领先的 RoomFinder 致力于为您在求学城市寻找最舒适的避风港。</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
          <div className="p-8 rounded-3xl bg-blue-50 border border-blue-100">
            <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
              <Target className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To simplify the room-hunting process for thousands of students, ensuring they find safe, affordable, and verified housing near their colleges.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-indigo-50 border border-indigo-100">
            <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
              <Users className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Focused</h3>
            <p className="text-gray-600 leading-relaxed">
              We empower local homeowners and domestic helpers, creating a localized ecosystem that benefits everyone in the neighborhood.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-rose-50 border border-rose-100">
            <div className="bg-rose-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-200">
              <Heart className="text-white w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Trust & Safety</h3>
            <p className="text-gray-600 leading-relaxed">
              Every listing is manually reviewed. We prioritize verified owners and transparent information to eliminate student housing fraud.
            </p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-[40px] p-12 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Join the RoomFinder Family</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Whether you are an owner with a spare room or a student looking for a home, we are here to help you every step of the way.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/search">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition-all">
                  Find a Room
                </button>
              </Link>
              <Link href="/signup">
                <button className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-bold transition-all">
                  List Property
                </button>
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        </div>
      </main>

      <footer className="py-12 border-t border-gray-100 text-center">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Home className="w-6 h-6 text-blue-600" />
          <span className="text-xl font-bold">RoomFinder</span>
        </div>
        <p className="text-gray-500 text-sm">Made with ❤️ for the student community.</p>
      </footer>
    </div>
  );
}

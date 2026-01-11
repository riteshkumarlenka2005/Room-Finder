import Navbar from "@/components/navbar";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-black text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-gray-600 max-w-2xl mx-auto领先的 RoomFinder 团队随时为您提供帮助。如有任何疑问，请随时联系我们。</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 md:p-10 rounded-[32px] shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                    <Input placeholder="John Doe" className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                    <Input placeholder="john@example.com" type="email" className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl h-12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Subject</label>
                  <Input placeholder="Inquiry about..." className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl h-12" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Message</label>
                  <Textarea placeholder="How can we help you?" className="bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-xl min-h-[150px]" />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                  <div className="relative z-10">
                    <Phone className="w-8 h-8 mb-6 opacity-80" />
                    <h3 className="text-xl font-bold mb-2">Call Us</h3>
                    <p className="text-blue-100 mb-4 text-sm leading-relaxed">Available Mon-Sat, 9AM to 6PM</p>
                    <p className="text-xl font-bold">+91 98765 43210</p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm group hover:border-blue-200 transition-colors">
                  <Mail className="w-8 h-8 mb-6 text-blue-600" />
                  <h3 className="text-xl font-bold mb-2">Email Us</h3>
                  <p className="text-gray-500 mb-4 text-sm leading-relaxed">We usually respond within 24 hours.</p>
                  <p className="text-lg font-bold text-gray-900">support@roomfinder.com</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-6 group hover:border-indigo-200 transition-colors">
                <div className="bg-indigo-50 p-4 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <MapPin className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">Headquarters</h3>
                  <p className="text-gray-600 leading-relaxed">
                    123, Student Hub, Near GIET University,<br />
                    Gunupur, Odisha - 765022
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-8 rounded-3xl text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">Live Support</h3>
                    <p className="text-blue-200 text-sm">Chat with our experts now</p>
                  </div>
                  <Button variant="secondary" className="rounded-xl font-bold">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full translate-x-10"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  Home,
  Users,
  Shield,
  Brain,
  CreditCard,
  MessageSquare,
  MapPin,
  Star,
  CheckCircle,
  TrendingUp,
  Globe,
  Lock,
  Zap,
} from "lucide-react"

export default function ProjectDocumentation() {
  const generatePDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">RoomFinder Platform</h1>
              <p className="text-blue-100 text-lg">Complete Room Rental Solution for Students & Property Owners</p>
            </div>
            <Button onClick={generatePDF} className="bg-white text-blue-600 hover:bg-blue-50">
              <Download className="w-4 h-4 mr-2" />
              Generate PDF
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Problem Statement */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Home className="w-6 h-6 mr-2 text-blue-600" />
              Problem Statement
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-red-600">Student Challenges</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Financial constraints preventing hostel accommodation</li>
                      <li>• Time-consuming room searching process</li>
                      <li>• Difficulty finding rooms matching group preferences</li>
                      <li>• Lack of cooking facilities and Maushi services</li>
                      <li>• No centralized platform for room hunting</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-red-600">General Public Issues</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Limited visibility for property owners</li>
                      <li>• Lack of detailed property information</li>
                      <li>• No standardized listing format</li>
                      <li>• Difficulty in location-based searching</li>
                      <li>• Trust and verification concerns</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Solution Overview */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-green-600" />
              Solution Overview
            </h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 mb-4">
                  <strong>RoomFinder</strong> is a comprehensive web-based platform that connects students and
                  individuals with property owners and Maushi service providers. The platform eliminates the need for
                  physical room hunting by providing detailed property information, location-based search, and
                  integrated communication tools.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-semibold">For Students</h4>
                    <p className="text-sm text-gray-600">Easy room search with group preferences</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Home className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-semibold">For Owners</h4>
                    <p className="text-sm text-gray-600">Showcase properties with detailed listings</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Star className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-semibold">For Maushi</h4>
                    <p className="text-sm text-gray-600">Connect with students needing cooking services</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Key Features */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-blue-600" />
              Key Features & Filtration Options
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Search & Filter Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm">
                        <strong>Location:</strong> State, District, City, Area, Lane
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Home className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">
                        <strong>Room Type:</strong> 1BHK, 2BHK, 3BHK, Single, Shared
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-purple-600" />
                      <span className="text-sm">
                        <strong>Occupancy:</strong> Single, 2-person, Group (5-6 members)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-orange-600" />
                      <span className="text-sm">
                        <strong>Price Range:</strong> Budget-based filtering
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <Badge variant="outline">Room Structure (BHK, Doors, Windows)</Badge>
                    <Badge variant="outline">Water System & Quality</Badge>
                    <Badge variant="outline">Flooring (Tiles/Cement)</Badge>
                    <Badge variant="outline">Balcony & Roof Access</Badge>
                    <Badge variant="outline">Vehicle Parking (2/4 Wheeler)</Badge>
                    <Badge variant="outline">Electricity (Separate/Included)</Badge>
                    <Badge variant="outline">Furniture Inventory</Badge>
                    <Badge variant="outline">Kitchen & Cooking Facilities</Badge>
                    <Badge variant="outline">Maushi Service Availability</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technical Architecture */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-2 text-blue-600" />
              Technical Architecture & Tools
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Frontend Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Framework:</span>
                      <Badge>Next.js 14 (App Router)</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Language:</span>
                      <Badge>TypeScript</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Styling:</span>
                      <Badge>Tailwind CSS</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">UI Components:</span>
                      <Badge>shadcn/ui</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Icons:</span>
                      <Badge>Lucide React</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Backend & Database</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Backend:</span>
                      <Badge>Next.js API Routes</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Database:</span>
                      <Badge>Supabase (PostgreSQL)</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Authentication:</span>
                      <Badge>Supabase Auth</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">File Storage:</span>
                      <Badge>Supabase Storage</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email Service:</span>
                      <Badge>Resend API</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* API & Integration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-green-600" />
              API Integration & Communication
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Payment APIs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Razorpay (UPI, Cards, Net Banking)</li>
                    <li>• Stripe (International)</li>
                    <li>• Digital Wallet System</li>
                    <li>• Subscription Management</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Communication APIs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Twilio (SMS/OTP)</li>
                    <li>• WhatsApp Business API</li>
                    <li>• Push Notifications</li>
                    <li>• Email Templates</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Location APIs</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Google Maps Integration</li>
                    <li>• Geocoding Services</li>
                    <li>• Location-based Search</li>
                    <li>• Distance Calculations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* AI/ML Integration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-purple-600" />
              AI/ML Integration Possibilities
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current AI Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Smart Recommendations</h4>
                      <p className="text-sm text-blue-600">ML-based room suggestions using collaborative filtering</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">Image Analysis</h4>
                      <p className="text-sm text-green-600">Computer vision for furniture detection in room photos</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800">Sentiment Analysis</h4>
                      <p className="text-sm text-purple-600">NLP for analyzing Maushi service reviews</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Future AI Enhancements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800">Voice Assistant</h4>
                      <p className="text-sm text-orange-600">Speech-to-text room search with NLP intent detection</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800">Dynamic Pricing</h4>
                      <p className="text-sm text-red-600">ML model for rent prediction based on demand and location</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-800">Fraud Detection</h4>
                      <p className="text-sm text-indigo-600">Anomaly detection for fake listings and spam prevention</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Security & Authentication */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-red-600" />
              Security & Authentication
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Authentication System</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">Email/Password with bcrypt hashing</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">Email verification with secure tokens</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">Phone number verification via OTP</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">Role-based access control (Student/Owner/Admin)</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">Session management with secure cookies</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-red-600" />
                      <span className="text-sm">Row Level Security (RLS) in database</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-red-600" />
                      <span className="text-sm">Encrypted payment processing</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-red-600" />
                      <span className="text-sm">Rate limiting for API endpoints</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-red-600" />
                      <span className="text-sm">Input validation and sanitization</span>
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-4 h-4 mr-2 text-red-600" />
                      <span className="text-sm">HTTPS encryption for all communications</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* User Workflows */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2 text-blue-600" />
              User Workflows
            </h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">For Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Registration & Search</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Sign up with email verification</li>
                        <li>Complete profile with preferences</li>
                        <li>Search rooms by location and filters</li>
                        <li>View detailed property information</li>
                        <li>Save favorite properties</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Booking & Communication</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Contact property owners directly</li>
                        <li>Schedule property visits</li>
                        <li>Make secure payments</li>
                        <li>Access Maushi services</li>
                        <li>Leave reviews and ratings</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-green-600">For Property Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Property Listing</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Create owner account with verification</li>
                        <li>Add property with detailed specifications</li>
                        <li>Upload high-quality photos</li>
                        <li>Set pricing and availability</li>
                        <li>Manage multiple properties</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Management & Analytics</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Receive booking inquiries</li>
                        <li>Communicate with potential tenants</li>
                        <li>Track property performance</li>
                        <li>Manage payments and bookings</li>
                        <li>Access analytics dashboard</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-purple-600">For Maushi Service Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Service Registration</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Register as Maushi service provider</li>
                        <li>Complete profile with specialties</li>
                        <li>Set service areas and pricing</li>
                        <li>Upload certificates and references</li>
                        <li>Define availability schedule</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Service Management</h4>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Receive service requests</li>
                        <li>Communicate with students</li>
                        <li>Manage multiple clients</li>
                        <li>Track earnings and payments</li>
                        <li>Build reputation through reviews</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Future Enhancements */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
              Future Technology Enhancements
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Advanced Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800">IoT Integration</h4>
                      <p className="text-sm text-blue-600">Smart home features, energy monitoring, security systems</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800">Blockchain</h4>
                      <p className="text-sm text-green-600">
                        Smart contracts for rent agreements, transparent transactions
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800">AR/VR Tours</h4>
                      <p className="text-sm text-purple-600">
                        Virtual property tours, augmented reality room visualization
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Platform Expansion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800">Multi-language Support</h4>
                      <p className="text-sm text-orange-600">Regional language support for wider accessibility</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800">Social Features</h4>
                      <p className="text-sm text-red-600">Student communities, roommate matching, social networking</p>
                    </div>
                    <div className="p-3 bg-indigo-50 rounded-lg">
                      <h4 className="font-semibold text-indigo-800">Marketplace</h4>
                      <p className="text-sm text-indigo-600">
                        Furniture rental, study materials, local services integration
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Benefits & Impact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-600" />
              Benefits & Social Impact
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-blue-600">For Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Time-saving room search</li>
                    <li>• Cost-effective accommodation</li>
                    <li>• Group accommodation options</li>
                    <li>• Integrated Maushi services</li>
                    <li>• Secure payment system</li>
                    <li>• Mobile accessibility</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-green-600">For Property Owners</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Wider reach and visibility</li>
                    <li>• Verified tenant profiles</li>
                    <li>• Streamlined booking process</li>
                    <li>• Analytics and insights</li>
                    <li>• Secure payment collection</li>
                    <li>• Reduced vacancy periods</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-purple-600">Social Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    <li>• Employment for Maushi providers</li>
                    <li>• Digital literacy promotion</li>
                    <li>• Reduced housing search time</li>
                    <li>• Transparent pricing</li>
                    <li>• Community building</li>
                    <li>• Economic empowerment</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Conclusion */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Conclusion</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">
                  The <strong>RoomFinder Platform</strong> addresses a critical real-world problem faced by students and
                  property seekers across India. By leveraging modern web technologies, AI/ML capabilities, and
                  comprehensive security measures, this platform creates a trustworthy ecosystem that benefits all
                  stakeholders. The project demonstrates practical application of full-stack development skills,
                  database management, API integration, and emerging technologies like AI and mobile development.
                </p>
                <Separator className="my-4" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Project Category: <span className="text-blue-600">Web Development</span>
                    </p>
                    <p className="text-sm text-gray-600">Full-stack application with AI/ML integration</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Production Ready
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center">
          <p className="text-gray-600 text-sm">Developed by: [Your Name] | 2nd Year B.Tech Student | [College Name]</p>
          <p className="text-gray-500 text-xs mt-1">Project Documentation - RoomFinder Platform</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
          .print-break { page-break-before: always; }
          .bg-gradient-to-br { background: white !important; }
          .shadow-xl { box-shadow: none !important; }
          .rounded-lg { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  )
}

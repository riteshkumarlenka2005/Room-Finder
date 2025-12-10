import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export function ContactSection() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4">
        <Card className="overflow-hidden border border-gray-200 shadow-md">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">

              {/* LEFT SIDE – CONTACT INFO */}
              <div className="bg-blue-600 p-8 md:p-10 text-white">
                <h2 className="mb-2 text-3xl font-bold">Get in Touch</h2>
                <p className="mb-8 text-blue-100">
                  Have questions or feedback? We’d love to hear from you!
                </p>

                <div className="space-y-6">

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Email</p>
                      <p className="font-medium">support@roomfinder.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Phone</p>
                      <p className="font-medium">+91 98765 43210</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-200">Location</p>
                      <p className="font-medium">Bhubaneswar, Odisha, India</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* RIGHT SIDE – CALL TO ACTION */}
              <div className="flex flex-col items-center justify-center bg-white p-8 md:p-10 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Need Help Finding a Room?
                </h3>

                <p className="mb-6 text-gray-600">
                  Our team is here to assist you in finding the perfect accommodation.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Us
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call Now
                  </Button>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

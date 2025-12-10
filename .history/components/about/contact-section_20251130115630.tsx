import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react"

export function ContactSection() {
  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <Card className="overflow-hidden border-2">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                {/* Left Side - Contact Info */}
                <div className="bg-primary p-8 text-primary-foreground md:p-10">
                  <h2 className="mb-2 text-2xl font-bold md:text-3xl">Get in Touch</h2>
                  <p className="mb-8 text-primary-foreground/80">
                    Have questions or feedback? We&apos;d love to hear from you!
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-primary-foreground/70">Email</p>
                        <p className="font-medium">support@roomfinder.com</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-primary-foreground/70">Phone</p>
                        <p className="font-medium">+91 98765 43210</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-primary-foreground/70">Location</p>
                        <p className="font-medium">Bhubaneswar, Odisha, India</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - CTA */}
                <div className="flex flex-col items-center justify-center bg-background p-8 text-center md:p-10">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <MessageCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Need Help Finding a Room?</h3>
                  <p className="mb-6 text-muted-foreground">
                    Our team is here to assist you in finding the perfect accommodation.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="lg">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Us
                    </Button>
                    <Button variant="outline" size="lg">
                      <Phone className="mr-2 h-4 w-4" />
                      Call Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

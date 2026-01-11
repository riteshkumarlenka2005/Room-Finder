import Navbar from "@/components/navbar";
import { ShieldCheck, Home } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-green-600 mb-6">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-bold tracking-tight text-blue-600">RoomFinder</span>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-8">Privacy Policy</h1>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us when you:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Create an account (Name, Email, Phone Number).</li>
                                <li>List a property (Address, Images, Rental Details).</li>
                                <li>Search for properties (Preferences, Saved Listings).</li>
                                <li>Communicate with other users via our platform.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                            <p>The information we collect is used to:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Facilitate the connecting of tenants and owners.</li>
                                <li>Verify listings and user identities for security.</li>
                                <li>Send technical notices, updates, and support messages.</li>
                                <li>Improve our platform's user experience and search algorithms.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sharing of Information</h2>
                            <p>
                                We do not sell your personal data. We share your information only with your consent or as necessary to provide our services (e.g., showing an owner's phone number to a tenant who clicks "Call").
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
                            <p>
                                We take reasonable measures to help protect your information from loss, theft, misuse, and unauthorized access. We use encryption (SSL/TLS) for data in transit and secure database practices (via Supabase).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Choices</h2>
                            <p>
                                You can access, update, or delete your profile information at any time by logging into your account settings. You may also contact us to request the complete deletion of your data.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <p className="text-sm">
                                Last updated: January 11, 2026. We may update this policy from time to time by posting a new version on this page.
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/">
                            <span className="text-blue-600 font-semibold hover:underline cursor-pointer flex items-center justify-center gap-1">
                                ← Return to Home
                            </span>
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="py-8 text-center text-gray-400 text-sm">
                <p>&copy; 2026 RoomFinder. All rights reserved.</p>
            </footer>
        </div>
    );
}

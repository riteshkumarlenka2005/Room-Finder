import Navbar from "@/components/navbar";
import { Home, Zap, Car } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 text-blue-600 mb-6">
                        <Home className="w-5 h-5" />
                        <span className="font-bold tracking-tight">RoomFinder</span>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-8">Terms of Service</h1>

                    <div className="prose prose-blue max-w-none text-gray-600 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p>
                                By accessing or using the RoomFinder platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                            <p>
                                RoomFinder is a platform that connects students seeking residential accommodation with property owners and domestic help services. We facilitate communication and listing of properties but do not own or manage any properties listed.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">For Tenants (Students):</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Provide accurate profile information.</li>
                                        <li>Communicate respectfully with owners.</li>
                                        <li>Verify property details independently before making payments.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">For Property Owners:</h3>
                                    <ul className="list-disc pl-5 space-y-2">
                                        <li>Ensure all listing details, including images and amenities, are accurate.</li>
                                        <li>Possess the legal right to rent the property.</li>
                                        <li>Adhere to fair housing laws and regulations.</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Activities</h2>
                            <p>Users are prohibited from:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Posting fraudulent or misleading content.</li>
                                <li>Harassing other users or platform staff.</li>
                                <li>Attempting to bypass platform security measures.</li>
                                <li>Using the platform for illegal purposes.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
                            <p>
                                RoomFinder shall not be held liable for any disputes, damages, or losses arising from interactions between users, including lease agreements or domestic help arrangements. All transactions are purely between the parties involved.
                            </p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <p className="text-sm">
                                Last updated: January 11, 2026. For questions regarding these terms, please contact our support team.
                            </p>
                        </section>
                    </div>

                    <div className="mt-12">
                        <Link href="/">
                            <span className="text-blue-600 font-semibold hover:underline cursor-pointer flex items-center gap-1">
                                ← Back to Home
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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { supabase } from "@/lib/supabase";

import {
  ArrowLeft,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  Star,
  Heart,
  Users,
  Utensils,
  Award,
  Clock,
} from "lucide-react";

export default function HelperDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [helper, setHelper] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------
  // FETCH HELPER DATA FROM SUPABASE
  // ---------------------------------------
  useEffect(() => {
    const fetchHelper = async () => {
      const { data, error } = await supabase
        .from("domestic_helpers")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) console.log("Error:", error);
      setHelper(data);
      setLoading(false);
    };

    fetchHelper();
  }, [params.id]);

  if (loading) return <p className="text-center py-20">Loading...</p>;

  if (!helper) return <p className="text-center py-20">Helper Not Found</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-700 hover:text-black mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Search
        </button>

        {/* ------------------------------------ */}
        {/* HERO SECTION - IMAGE + CONTACT CARD */}
        {/* ------------------------------------ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* IMAGE */}
          <div className="col-span-2">
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              <img
                src="/placeholder.svg?height=500"
                className="w-full h-full object-cover"
                alt="helper photo"
              />
              <span className="absolute top-4 left-4 bg-green-600 text-white px-4 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Verified
              </span>
            </div>
          </div>

          {/* CONTACT CARD */}
          <div className="bg-white rounded-lg shadow p-6 border">
            <h2 className="text-xl font-bold mb-4">Contact Helper</h2>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl font-bold">
                {helper.full_name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{helper.full_name}</p>
                <p className="text-sm text-gray-500">Member recently</p>
              </div>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 mb-3">
              <Phone className="w-4 h-4" /> Call {helper.phone}
            </button>

            <button className="w-full border py-3 rounded-lg flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" /> Send Message
            </button>

            <div className="mt-6 text-sm text-gray-600">
              <p>
                <strong>Available from:</strong> Immediately
              </p>
              <p>
                <strong>Last updated:</strong> Recently
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------------------ */}
        {/* BASIC DETAILS */}
        {/* ------------------------------------ */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow border">
          <h1 className="text-3xl font-bold mb-2">{helper.full_name}</h1>

          <div className="flex items-center gap-4 text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            {helper.city}, {helper.district}
          </div>

          <div className="flex items-center gap-6 mt-2">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-purple-600" />
              {helper.experience_years} years experience
            </span>

            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Available for Students
            </span>
          </div>

          <p className="mt-4 text-gray-700">{helper.bio || "No bio available"}</p>
        </div>

        {/* ------------------------------------ */}
        {/* SKILLS SECTION */}
        {/* ------------------------------------ */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow border">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>

          <div className="flex flex-wrap gap-3">
            {helper.house_cleaning && <span className="px-3 py-1 bg-gray-100 rounded">House Cleaning</span>}
            {helper.child_care && <span className="px-3 py-1 bg-gray-100 rounded">Child Care</span>}
            {helper.laundry && <span className="px-3 py-1 bg-gray-100 rounded">Laundry</span>}
            {helper.pet_care && <span className="px-3 py-1 bg-gray-100 rounded">Pet Care</span>}
            {helper.elderly_care && <span className="px-3 py-1 bg-gray-100 rounded">Elderly Care</span>}
            {helper.kitchen_cleaning && <span className="px-3 py-1 bg-gray-100 rounded">Kitchen Cleaning</span>}
            {helper.other_skills && (
              <span className="px-3 py-1 bg-gray-100 rounded">{helper.other_skills}</span>
            )}
          </div>
        </div>

        {/* ------------------------------------ */}
        {/* CONTACT SECTION BOTTOM */}
        {/* ------------------------------------ */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow border">
          <h2 className="text-2xl font-bold mb-4">Contact Details</h2>

          <p className="text-gray-700 mb-2">
            <strong>Phone:</strong> {helper.phone}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>WhatsApp:</strong> {helper.whatsapp}
          </p>
          <p className="text-gray-700">
            <strong>Address:</strong> {helper.address}
          </p>
        </div>

        <div className="h-20" />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/navbar";

import {
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  Users,
  ChefHat,
  Utensils,
  Star,
} from "lucide-react";

export default function HelperDetailsPage() {
  const { id } = useParams();
  const [helper, setHelper] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHelperDetails();
  }, [id]);

  async function fetchHelperDetails() {
    setLoading(true);

    const { data, error } = await supabase
      .from("domestic_helpers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) console.error(error);
    else setHelper(data);

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading details...
      </div>
    );
  }

  if (!helper) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-red-600">
        Helper not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {helper.full_name}
                <CheckCircle className="w-6 h-6 text-green-600" />
              </h1>

              <div className="flex items-center text-gray-600 mt-2">
                <MapPin className="w-4 h-4 mr-2" />
                {helper.city}, {helper.district}, {helper.state}
              </div>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-purple-600">₹{helper.salaryMin}</p>
              <p className="text-sm text-gray-500">per month</p>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6">

          {/* Experience */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Experience</h2>
            <p className="text-gray-700">{helper.experience_years}+ years</p>
          </div>

          {/* Bio */}
          {helper.other_skills && (
            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-gray-700 leading-relaxed">{helper.other_skills}</p>
            </div>
          )}

          {/* Skills */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {helper.house_cleaning && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  House Cleaning
                </span>
              )}
              {helper.child_care && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Child Care
                </span>
              )}
              {helper.laundry && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Laundry
                </span>
              )}
              {helper.elderly_care && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Elderly Care
                </span>
              )}
              {helper.kitchen_cleaning && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Kitchen Cleaning
                </span>
              )}
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Contact Information</h2>

            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <span className="text-lg text-gray-700">{helper.phone}</span>
            </div>

            {helper.whatsapp && (
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span className="text-lg text-gray-700">{helper.whatsapp}</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <a href={`tel:${helper.phone}`}>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Call Now
              </button>
            </a>

            <a href={`https://wa.me/${helper.whatsapp}`} target="_blank">
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                WhatsApp
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

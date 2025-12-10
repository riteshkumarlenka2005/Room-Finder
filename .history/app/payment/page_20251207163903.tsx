"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const params = useSearchParams();
  const propertyId = params.get("property_id");
  const router = useRouter();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("id", propertyId)
        .single();

      setProperty(data);
    };

    if (propertyId) fetchProperty();
  }, [propertyId]);

  const handlePaymentSuccess = async () => {
    setLoading(true);

    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;

    if (!user) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      property_id: propertyId,
      user_id: user.id,

      tenant_name: user.user_metadata?.full_name ?? "Guest",
      tenant_email: user.email,
      tenant_phone: "9999999999",

      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],

      rent: property?.monthly_rent ?? property?.price ?? 0,

      status: "pending",
      payment_status: "paid",
    });

    if (error) {
      alert("Booking Failed");
      console.error(error);
      setLoading(false);
      return;
    }

    alert("Booking Successful!");
    router.push("/user/bookings");
  };

  if (!property) return <div className="p-10">Loading Payment...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Confirm Booking</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><b>Property:</b> {property.title}</div>
          <div><b>Rent:</b> ₹{property.monthly_rent}</div>
          <div><b>Payment Type:</b> One-Time Advance</div>

          <Button
            onClick={handlePaymentSuccess}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? "Processing..." : "Pay & Book Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

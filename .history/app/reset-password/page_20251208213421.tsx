"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type Strength = "weak" | "medium" | "strong";

function evaluateStrength(password: string): Strength {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 3) return "strong";
  if (score === 2) return "medium";
  return "weak";
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const strength = evaluateStrength(password);

  // ✅ ✅ ✅ FINAL SESSION CREATION (ACCESS TOKEN FLOW)
  useEffect(() => {
    const access_token = searchParams.get("access_token");
    const refresh_token = searchParams.get("refresh_token");
    const type = searchParams.get("type");

    if (type === "recovery" && access_token && refresh_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token,
      });
    }
  }, [searchParams]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!password || !confirm) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (strength === "weak") {
      setError(
        "Password must be at least 8 characters with a number, uppercase letter, and symbol."
      );
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage("✅ Password updated successfully! Redirecting to login...");

    setTimeout(() => {
      router.push("/login");
    }, 1500);

    setLoading(false);
  };

  const strengthLabel =
    strength === "strong"
      ? "Strong"
      : strength === "medium"
      ? "Medium"
      : "Weak";

  const strengthColor =
    strength === "strong"
      ? "text-green-600"
      : strength === "medium"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Set New Password</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {password && (
                  <p className={`text-xs mt-1 ${strengthColor}`}>
                    Strength: {strengthLabel}
                  </p>
                )}
              </div>

              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  required
                  placeholder="Re-enter new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 text-center">{error}</div>
              )}

              {message && (
                <div className="text-sm text-green-600 text-center">
                  {message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client"

import { useRouter } from "next/navigation"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Lock,
  Check,
  Copy,
  Download,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const BOOKING_AMOUNT = 4500

export default function PaymentPage() {
  const [expandedSection, setExpandedSection] = useState("upi")
  const [upiTab, setUpiTab] = useState("apps")
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay")
  const [selectedBank, setSelectedBank] = useState("")
  const [upiId, setUpiId] = useState("")
  const [upiVerified, setUpiVerified] = useState(false)
  const [upiVerifying, setUpiVerifying] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const router = useRouter()

  const handlePayment = async () => {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setIsLoading(false)
    setPaymentSuccess(true)
    setShowConfetti(true)
  }

  const handleVerifyUpi = async () => {
    console.log("[v0] handleVerifyUpi called, upiId:", upiId)
    if (!upiId || !upiId.includes("@")) {
      console.log("[v0] UPI ID invalid - needs @ symbol")
      return
    }
    console.log("[v0] Starting verification...")
    setUpiVerifying(true)
    await new Promise((r) => setTimeout(r, 1500))
    setUpiVerifying(false)
    setUpiVerified(true)
    console.log("[v0] UPI ID verified!")
  }

  const getPayButtonText = () => {
    const amt = "4,500"
    const appNames: Record<string, string> = {
      gpay: "Google Pay",
      phonepe: "PhonePe",
      paytm: "Paytm",
      bhim: "BHIM",
    }
    if (expandedSection === "upi" && upiTab === "apps" && selectedUpiApp) {
      return "Pay Rs." + amt + ".00 via " + appNames[selectedUpiApp]
    }
    if (expandedSection === "card") {
      return "Pay Rs." + amt + ".00 via Card"
    }
    if (expandedSection === "netbanking" && selectedBank) {
      return "Pay Rs." + amt + ".00 via " + selectedBank
    }
    return "Pay Rs." + amt + ".00"
  }

  if (paymentSuccess) {
    return <SuccessScreen onReset={() => setPaymentSuccess(false)} showConfetti={showConfetti} />
  }

  const upiApps = [
    { id: "gpay", name: "Google Pay", icon: "G", colors: "bg-white border-slate-200" },
    { id: "phonepe", name: "PhonePe", icon: "Pe", colors: "bg-indigo-600 text-white" },
    { id: "paytm", name: "Paytm", icon: "Pa", colors: "bg-blue-500 text-white" },
    { id: "bhim", name: "BHIM", icon: "B", colors: "bg-slate-100 text-slate-700" },
  ]

  const banks = [
    { id: "SBI", icon: "SBI", color: "text-blue-600" },
    { id: "HDFC", icon: "HDFC", color: "text-blue-800" },
    { id: "ICICI", icon: "i", color: "text-orange-500" },
    { id: "Axis", icon: "A", color: "text-rose-600" },
    { id: "Kotak", icon: "Ko", color: "text-red-600" },
    { id: "More", icon: "Mo", color: "text-slate-500" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 hover:bg-slate-100 rounded-lg">
            <ArrowLeft className="h-5 w-5 text-slate-700" />
            </button>

            <h1 className="text-lg font-semibold text-slate-900">Checkout</h1>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <ShieldCheck className="h-4 w-4" />
            <span className="text-sm font-medium">100% Secure</span>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-5 space-y-5 pb-44">
        <div className="bg-slate-800 rounded-2xl p-5 text-white">
          <p className="text-slate-400 text-sm mb-1">Total Payable Amount</p>
          <p className="text-4xl font-bold mb-4">
            Rs.4,500<span className="text-xl text-slate-400">.00</span>
          </p>
          <div className="border-t border-slate-700 pt-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">Grand Hyatt Mumbai</p>
              <p className="text-slate-400 text-sm">Standard Room - 2 Nights</p>
            </div>
            <button className="flex items-center gap-1 text-slate-300 hover:text-white">
              <span className="text-sm">Details</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Select Payment Method</h2>
          <div className="space-y-3">
            {/* UPI */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "upi" ? "" : "upi")}
                className={cn(
                  "w-full flex items-center justify-between p-4",
                  expandedSection === "upi" && "border-b border-slate-100",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">UPI</p>
                    <p className="text-sm text-slate-500">Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>
                {expandedSection === "upi" ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {expandedSection === "upi" && (
                <div className="p-4 space-y-4">
                  <div className="flex bg-slate-100 rounded-xl p-1">
                    {["apps", "upi-id", "qr"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setUpiTab(tab)}
                        className={cn(
                          "flex-1 py-2.5 text-sm font-medium rounded-lg",
                          upiTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500",
                        )}
                      >
                        {tab === "apps" ? "Apps" : tab === "upi-id" ? "UPI ID" : "QR Code"}
                      </button>
                    ))}
                  </div>

                  {upiTab === "apps" && (
                    <div className="space-y-2">
                      {upiApps.map((app) => (
                        <button
                          key={app.id}
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-xl border-2",
                            selectedUpiApp === app.id
                              ? "border-blue-500 bg-blue-50/50"
                              : "border-slate-200 hover:border-slate-300",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border",
                                app.colors,
                              )}
                            >
                              {app.icon}
                            </div>
                            <span className="font-medium text-slate-900">{app.name}</span>
                          </div>
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                              selectedUpiApp === app.id ? "border-blue-500 bg-blue-500" : "border-slate-300",
                            )}
                          >
                            {selectedUpiApp === app.id && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {upiTab === "upi-id" && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-sm text-slate-600">Enter UPI ID</Label>
                        <div className="relative">
                          <Input
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value)
                              setUpiVerified(false)
                            }}
                            className={cn(
                              "h-12 bg-slate-50 border-slate-200",
                              upiVerified && "border-emerald-500 bg-emerald-50/50",
                            )}
                          />
                          {upiVerified && (
                            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">Example: name@okaxis, name@ybl, name@paytm</p>
                      <Button
                        onClick={handleVerifyUpi}
                        disabled={!upiId || !upiId.includes("@") || upiVerifying || upiVerified}
                        className={cn(
                          "w-full h-11 font-medium rounded-xl",
                          upiVerified ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-600 hover:bg-blue-700",
                        )}
                      >
                        {upiVerifying ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying...
                          </span>
                        ) : upiVerified ? (
                          <span className="flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            UPI ID Verified
                          </span>
                        ) : (
                          "Verify UPI ID"
                        )}
                      </Button>
                    </div>
                  )}

                  {upiTab === "qr" && (
                    <div className="flex flex-col items-center py-4">
                      <div className="w-48 h-48 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center p-3">
                        <div className="w-full h-full bg-slate-900 rounded-lg" />
                      </div>
                      <p className="text-sm text-slate-500 mt-4">Scan with any UPI app to pay</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "card" ? "" : "card")}
                className={cn(
                  "w-full flex items-center justify-between p-4",
                  expandedSection === "card" && "border-b border-slate-100",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Card Payment</p>
                    <p className="text-sm text-slate-500">Credit or Debit Card</p>
                  </div>
                </div>
                {expandedSection === "card" ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {expandedSection === "card" && (
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Card Number</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="h-12 pl-11 bg-slate-50 border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-600">Valid Thru</Label>
                      <Input
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="h-12 bg-slate-50 border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-slate-600">CVV</Label>
                      <Input
                        placeholder="123"
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="h-12 bg-slate-50 border-slate-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-600">Name on Card</Label>
                    <Input
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="h-12 bg-slate-50 border-slate-200"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <span className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-md border">
                      VISA
                    </span>
                    <span className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-md border">
                      MC
                    </span>
                    <span className="px-3 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 rounded-md border">
                      RUPAY
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Net Banking */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === "netbanking" ? "" : "netbanking")}
                className={cn(
                  "w-full flex items-center justify-between p-4",
                  expandedSection === "netbanking" && "border-b border-slate-100",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Net Banking</p>
                    <p className="text-sm text-slate-500">All Indian banks supported</p>
                  </div>
                </div>
                {expandedSection === "netbanking" ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {expandedSection === "netbanking" && (
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-3">
                    {banks.map((bank) => (
                      <button
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id === "More" ? "" : bank.id)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2",
                          selectedBank === bank.id
                            ? "border-blue-500 bg-blue-50/50"
                            : "border-slate-200 hover:border-slate-300",
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm",
                            bank.color,
                          )}
                        >
                          {bank.icon}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{bank.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
        <div className="max-w-xl mx-auto">
          <Button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            {isLoading ? (
              <span className="flex items-center gap-3">
                <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              getPayButtonText()
            )}
          </Button>
          <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Secured by 256-bit Bank Grade Encryption
          </p>
        </div>
      </div>
    </div>
  )
}

function SuccessScreen({ onReset, showConfetti }: { onReset: () => void; showConfetti: boolean }) {
  const bookingId = "BK-658253"
  const [copied, setCopied] = useState(false)
  const [confetti, setConfetti] = useState<
    Array<{ id: number; left: number; delay: number; color: string; size: number }>
  >([])

  useEffect(() => {
    if (showConfetti) {
      const colors = [
        "#f472b6",
        "#a78bfa",
        "#60a5fa",
        "#34d399",
        "#fbbf24",
        "#fb923c",
        "#f87171",
        "#c084fc",
        "#22d3ee",
        "#a3e635",
        "#e879f9",
        "#38bdf8",
      ]
      const pieces = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
      }))
      setConfetti(pieces)
    }
  }, [showConfetti])

  const copyId = () => {
    navigator.clipboard.writeText(bookingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadReceipt = () => {
    const lines = [
      "======================================================",
      "                   PAYMENT RECEIPT                     ",
      "                     RoomFinder                        ",
      "======================================================",
      "",
      "  Booking Reference: " + bookingId,
      "",
      "  Property:        Grand Hyatt Mumbai",
      "  Room Type:       Standard Room",
      "  Duration:        2 Nights",
      "",
      "  Amount Paid:     Rs.4,500.00",
      "  Payment Date:    07 Dec, 2025",
      "  Payment Status:  SUCCESSFUL",
      "",
      "  Thank you for booking with RoomFinder!",
      "",
      "======================================================",
    ]
    const content = lines.join("\n")
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "RoomFinder-Receipt-" + bookingId + ".txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute animate-confetti"
              style={{
                left: piece.left + "%",
                top: "-20px",
                width: piece.size + "px",
                height: piece.size + "px",
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                animationDelay: piece.delay + "s",
                animationDuration: 4 + Math.random() * 2 + "s",
              }}
            />
          ))}
        </div>
      )}

      {/* Success Card */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative z-10">
        <div className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 w-full" />
        <div className="p-8 text-center">
          {/* Animated Checkmark */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
            <div className="relative w-full h-full bg-emerald-100 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce-in">
                <Check className="h-10 w-10 text-white stroke-[3]" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
          <p className="text-slate-500 mb-6">Your room has been booked securely.</p>

          <div className="bg-slate-50 rounded-xl p-5 mb-6">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Booking Reference</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <p className="text-2xl font-mono font-bold text-slate-900">{bookingId}</p>
              <button onClick={copyId} className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-slate-400" />}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div className="text-left">
                <p className="text-xs text-slate-400 mb-1">Amount Paid</p>
                <p className="font-semibold text-slate-900">Rs.4,500.00</p>
              </div>
              <div className="text-left">
                <p className="text-xs text-slate-400 mb-1">Date</p>
                <p className="font-semibold text-slate-900">07 Dec, 2025</p>
              </div>
            </div>
          </div>

          <Button
            onClick={downloadReceipt}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold mb-3 transition-all hover:scale-[1.02]"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>

          <button
            onClick={onReset}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Make Another Payment
          </button>
        </div>
      </div>
    </div>
  )
}

    
// "use client"

// import Link from "next/link"
// import { useState } from "react"
// import { Home, ChevronDown } from "lucide-react"
// import { Button } from "@/components/ui/button"

// export default function Navbar() {
//   const [open, setOpen] = useState(false)

//   return (
//     <header className="bg-white shadow-sm border-b relative">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">

//           {/* Logo */}
//           <Link href="/" className="flex items-center">
//             <Home className="h-8 w-8 text-blue-600" />
//             <span className="ml-2 text-xl font-bold text-gray-900">RoomFinder</span>
//           </Link>

//           {/* Navigation */}
//           <nav className="hidden md:flex space-x-8 items-center">

//             <Link href="/search" className="text-gray-700 hover:text-blue-600">
//               Search Rooms
//             </Link>

//             {/* Dropdown for List Property */}
//             <div className="relative">
//               <button
//                 onClick={() => setOpen(!open)}
//                 className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
//               >
//                 List Property
//                 <ChevronDown className="ml-1 h-4 w-4" />
//               </button>

//               {open && (
//                 <div className="absolute mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
//                   <Link
//                     href="/list-property"
//                     className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
//                     onClick={() => setOpen(false)}
//                   >
//                     Owner
//                   </Link>
//                   <Link
//                     href="/list-helper"
//                     className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
//                     onClick={() => setOpen(false)}
//                   >
//                     Domestic Helper
//                   </Link>
//                 </div>
//               )}
//             </div>

//             <Link href="/maushi-services" className="text-gray-700 hover:text-blue-600">
//               Domestic helper
//             </Link>

//             <Link href="/about" className="text-gray-700 hover:text-blue-600">
//               About
//             </Link>
//           </nav>

//           {/* Auth */}
//           <div className="flex items-center space-x-4">
//             <Link href="/login">
//               <Button variant="outline">Login</Button>
//             </Link>
//             <Link href="/signup">
//               <Button>Sign Up</Button>
//             </Link>
//           </div>

//         </div>
//       </div>
//     </header>
//   )
// }


"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Home, ChevronDown, LogOut, HelpCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  // ✅ Detect login session
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user || null)
    }

    getUser()

    // ✅ Listen to auth changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // ✅ Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <header className="bg-white shadow-sm border-b relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">RoomFinder</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">

            <Link href="/search" className="text-gray-700 hover:text-blue-600">
              Search Rooms
            </Link>

            {/* Dropdown for List Property */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                List Property
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {open && (
                <div className="absolute mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                  <Link
                    href="/list-property"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => setOpen(false)}
                  >
                    Owner
                  </Link>
                  <Link
                    href="/list-helper"
                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                    onClick={() => setOpen(false)}
                  >
                    Domestic Helper
                  </Link>
                </div>
              )}
            </div>

            <Link href="/maushi-services" className="text-gray-700 hover:text-blue-600">
              Domestic helper
            </Link>

            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
          </nav>

          {/* ✅ AUTH SECTION (SMART LOGIC) */}
          <div className="flex items-center space-x-4 relative">

            {/* ✅ IF USER IS LOGGED IN → SHOW PROFILE */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase"
                >
                  {user.user_metadata?.full_name?.charAt(0) || "U"}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">

                    {/* USER INFO */}
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold text-gray-800">
                        {user.user_metadata?.full_name || "User"}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>

                    {/* OPTIONS */}
                    <div className="py-2">
                      <Link
                        href="/help"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => setProfileOpen(false)}
                      >
                        <HelpCircle className="w-4 h-4" />
                        Help
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* ✅ IF NOT LOGGED IN → SHOW LOGIN & SIGNUP */}
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}

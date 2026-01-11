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
import { Home, ChevronDown, LogOut, HelpCircle, User, Menu, Search, Info, Briefcase, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const NavLinks = [
    { name: "Search Rooms", href: "/search", icon: Search },
    { name: "Domestic helper", href: "/maushi-services", icon: Briefcase },
    { name: "About", href: "/about", icon: Info },
  ]

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
              RoomFinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {NavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Dropdown for List Property */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors focus:outline-none"
              >
                List Property
                <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", open && "rotate-180")} />
              </button>

              {open && (
                <div className="absolute top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <Link
                    href="/list-property"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Home className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Owner</p>
                      <p className="text-xs text-gray-400">List your property</p>
                    </div>
                  </Link>
                  <Link
                    href="/list-helper"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700 transition-colors border-t border-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Domestic Helper</p>
                      <p className="text-xs text-gray-400">Register as helper</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Auth Section & Mobile Toggle */}
          <div className="flex items-center space-x-2 md:space-x-4">

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-semibold border-2 border-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    {user.user_metadata?.full_name?.charAt(0) || "U"}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-4 bg-gray-50/50 border-b border-gray-100">
                        <p className="font-bold text-gray-900 leading-tight">
                          {user.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>

                      <div className="p-1.5">
                        <Link
                          href="/help"
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <HelpCircle className="w-4.5 h-4.5 text-gray-400" />
                          <span className="text-sm font-medium">Help Center</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <LogOut className="w-4.5 h-4.5" />
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="ghost" className="font-semibold">Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm font-semibold">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Navigation Toggle */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
                    <Menu className="h-6 w-6 text-gray-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                  <div className="flex flex-col h-full bg-white">
                    <SheetHeader className="p-6 border-b text-left">
                      <SheetTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="bg-blue-600 p-1 rounded-lg">
                          <Home className="h-5 w-5 text-white" />
                        </div>
                        RoomFinder
                      </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto py-4 px-2">
                      {/* USER PROFILE INFO ON MOBILE */}
                      {user && (
                        <div className="px-4 py-4 mb-4 bg-blue-50/50 rounded-2xl mx-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                              {user.user_metadata?.full_name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 leading-none mb-1">
                                {user.user_metadata?.full_name || "User"}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-[180px]">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        {NavLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 text-gray-700 font-semibold transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <link.icon className="w-5 h-5 text-blue-500" />
                            {link.name}
                          </Link>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t px-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Listings</p>
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            href="/list-property"
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 group"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <PlusCircle className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold">Owner</span>
                          </Link>
                          <Link
                            href="/list-helper"
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-purple-50 hover:text-purple-600 transition-all border border-transparent hover:border-purple-100 group"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                              <User className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-bold">Helper</span>
                          </Link>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t bg-gray-50/50">
                      {user ? (
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                          onClick={() => {
                            handleLogout()
                            setIsMobileMenuOpen(false)
                          }}
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Sign Out
                        </Button>
                      ) : (
                        <div className="grid grid-cols-2 gap-3">
                          <Link href="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full font-bold">Log In</Button>
                          </Link>
                          <Link href="/signup" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                            <Button className="w-full bg-blue-600 font-bold">Sign Up</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

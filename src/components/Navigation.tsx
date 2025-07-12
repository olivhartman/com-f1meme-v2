"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, Users, ArrowLeft, ChevronLeft } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Link, useNavigate, useLocation } from "react-router-dom"

interface NavigationProps {
  activeSection: string
}

export default function Navigation({ activeSection }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { publicKey } = useWallet()
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug logging
  console.log('Navigation - Wallet connected:', !!publicKey)
  console.log('Navigation - Public key:', publicKey?.toBase58())

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      })
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-24"
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-stretch justify-between h-full">
            {/* Left: Back button only on /profile */}
            {(location.pathname === "/profile" || location.pathname === "/community") && (
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center w-13 h-13 rounded-full hover:bg-yellow-500 hover:border-yellow-700 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-600 self-end"
                aria-label="Go back to home"
              >
                <svg width="88" height="88" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L10 14L18 22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* Center: Logo or empty for now */}
            <div></div>

            {/* Right: Profile and Community buttons always visible, side by side */}
            <div className="flex flex-row items-end gap-3 h-full">
              <Link
                to="/community"
                className="mt-3 flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 border-yellow-600 shadow-lg hover:bg-yellow-100 hover:border-yellow-700 transition-all font-bold text-yellow-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                <Users className="h-6 w-6 text-yellow-900" />
              </Link>
              {publicKey && (
                <Link
                  to="/profile"
                  className="mt-3 flex items-center justify-center w-11 h-11 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-lg hover:bg-yellow-500 hover:border-yellow-700 transition-all font-bold text-yellow-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-600"
                >
                  <User className="h-6 w-6 text-yellow-900" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/95 pt-20"
          >
            <nav className="container mx-auto px-4 py-8 flex flex-col gap-6">
              
              {/* Profile Link - Only show if wallet is connected */}
              {publicKey && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xl font-medium py-4 border-b border-gray-800 text-yellow-500"
                >
                  <User size={20} />
                  Profile
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


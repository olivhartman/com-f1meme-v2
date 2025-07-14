"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, Users, Calendar } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Link, useNavigate, useLocation } from "react-router-dom"

interface NavigationProps {}

export default function Navigation({}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { publicKey } = useWallet()
  const navigate = useNavigate();
  const location = useLocation();
  
  // Debug logging
  console.log('Navigation - Wallet connected:', !!publicKey)
  console.log('Navigation - Public key:', publicKey?.toBase58())

  useEffect(() => {
    const handleScroll = () => {
      // setIsScrolled(window.scrollY > 50) // This line was removed as per the edit hint
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Remove unused imports
  // import { ArrowLeft, ChevronLeft } from 'lucide-react';
  // Remove unused variables
  // const activeSection = ...;
  // const isScrolled = ...;
  // const scrollToSection = ...;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-24"
      >
        <div className="container mx-auto px-4 h-full mt-10">
          <div className="flex items-center justify-between h-full">
            {/* Left: Logo always visible */}
            <div className="flex items-center h-16">
              <Link to="/" className="flex items-center justify-center ml-3 sm:ml-0">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-white flex items-center justify-center">
                  <img
                    src="/assets/images/favicon.svg"
                    alt="F1 Meme Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>

            {/* Center: Remove empty div */}

            {/* Right: Profile and Community buttons always visible, side by side (desktop only) */}
            <div className="hidden sm:flex flex-row items-center gap-3 h-16">
              <Link
                to="/community"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 border-yellow-600 shadow-lg hover:bg-yellow-100 hover:border-yellow-700 transition-all font-bold text-yellow-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                <Users className="h-6 w-6 text-yellow-900" />
              </Link>
              <Link
                to="/schedule"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 border-yellow-600 shadow-lg hover:bg-yellow-100 hover:border-yellow-700 transition-all font-bold text-yellow-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                <Calendar className="h-6 w-6 text-yellow-900" />
              </Link>
              {publicKey && (
                <Link
                  to="/profile"
                  className="flex items-center justify-center w-11 h-11 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-lg hover:bg-yellow-500 hover:border-yellow-700 transition-all font-bold text-yellow-900 text-base focus:outline-none focus:ring-2 focus:ring-yellow-600"
                >
                  <User className="h-6 w-6 text-yellow-900" />
                </Link>
              )}
            </div>

            {/* Hamburger menu for mobile */}
            <div className="flex sm:hidden items-center h-16">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-lg hover:bg-yellow-500 hover:border-yellow-700 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-600"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6 text-yellow-900" /> : <Menu className="h-6 w-6 text-yellow-900" />}
              </button>
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
            className="fixed inset-0 z-40 bg-black/95 pt-24"
          >
            <nav className="container mx-auto px-4 py-8 flex flex-col gap-6">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xl font-medium py-4 border-b border-gray-800 text-yellow-500"
              >
                Home
              </Link>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xl font-medium py-4 border-b border-gray-800 text-yellow-500"
              >
                Community
              </Link>
              <Link
                to="/schedule"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xl font-medium py-4 border-b border-gray-800 text-yellow-500"
              >
                Schedule
              </Link>
              {publicKey && (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xl font-medium py-4 border-b border-gray-800 text-yellow-500"
                >
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


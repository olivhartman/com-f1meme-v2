"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, Users, Calendar, Image } from "lucide-react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Link } from "react-router-dom"

interface NavigationProps {}

export default function Navigation({}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const wallet = useWallet()
  const { publicKey } = wallet

  // Debug logging
  useEffect(() => {
    console.log('--- Navigation Rendered ---')
    console.log('Wallet object:', wallet)
    console.log('Wallet connected:', wallet.connected)
    console.log('Wallet connecting:', wallet.connecting)
    console.log('Wallet disconnecting:', wallet.disconnecting)
    console.log('Wallet adapter:', wallet.wallet)
    console.log('Public key:', publicKey?.toBase58())
  }, [publicKey, wallet.connected, wallet.connecting, wallet.disconnecting, wallet.wallet])

  useEffect(() => {
    if (publicKey && showConnectModal) {
      setShowConnectModal(false);
    }
  }, [publicKey, showConnectModal]);


  // Remove unused imports
  // import { ArrowLeft, ChevronLeft } from 'lucide-react';
  // Remove unused variables
  // const activeSection = ...;
  // const isScrolled = ...;
  // const scrollToSection = ...;

  return (
    <>
      {/* Modal for connect wallet */}
      {showConnectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-xs w-full flex flex-col items-center">
            <div className="mb-4">
              <User className="h-10 w-10 text-[#272AE9] mx-auto" strokeWidth={2} />
            </div>
            <h2 className="text-lg font-bold text-[#272AE9] mb-2 text-center">Connect Your Wallet</h2>
            <p className="text-gray-700 text-center mb-6">Please connect your wallet first to access your profile.</p>
            <button
              onClick={() => setShowConnectModal(false)}
              className="mt-2 px-6 py-2 rounded-lg bg-[#FBEB04] text-[#272AE9] font-semibold shadow hover:bg-yellow-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
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
                <div className="w-11 h-11 rounded-lg overflow-hidden bg-white flex items-center justify-center">
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
                className="flex items-center justify-center w-11 h-11 rounded-lg bg-white border-2 border-[#FBEB04] shadow-lg hover:bg-[#FBEB04]/10 hover:border-[#FBEB04] transition-all font-bold text-[#272AE9] text-base focus:outline-none focus:ring-2 focus:ring-[#FBEB04]"
              >
                <Users className="h-6 w-6 text-[#272AE9]" strokeWidth={2} />
              </Link>
              <Link
                to="/schedule"
                className="flex items-center justify-center w-11 h-11 rounded-lg bg-white border-2 border-[#FBEB04] shadow-lg hover:bg-[#FBEB04]/10 hover:border-[#FBEB04] transition-all font-bold text-[#272AE9] text-base focus:outline-none focus:ring-2 focus:ring-[#FBEB04]"
              >
                <Calendar className="h-6 w-6 text-[#272AE9]" strokeWidth={2} />
              </Link>
              <Link
                to="/gallery"
                className="flex items-center justify-center w-11 h-11 rounded-lg bg-white border-2 border-[#FBEB04] shadow-lg hover:bg-[#FBEB04]/10 hover:border-[#FBEB04] transition-all font-bold text-[#272AE9] text-base focus:outline-none focus:ring-2 focus:ring-[#FBEB04]"
              >
                <Image className="h-6 w-6 text-[#272AE9]" strokeWidth={2} />
              </Link>
              <Link
                to={publicKey ? "/profile" : "#"}
                onClick={e => {
                  if (!publicKey) {
                    e.preventDefault();
                    setShowConnectModal(true);
                  }
                }}
                className="flex items-center justify-center w-11 h-11 rounded-lg bg-white border-2 border-[#FBEB04] shadow-lg hover:bg-[#FBEB04]/80 hover:border-[#FBEB04] transition-all font-bold text-[#272AE9] text-base focus:outline-none focus:ring-2 focus:ring-[#FBEB04]"
              >
                <User className="h-6 w-6 text-[#272AE9]" strokeWidth={2} />
              </Link>
            </div>

            {/* Hamburger menu for mobile */}
            <div className="flex sm:hidden items-center h-16">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#FBEB04] border-2 border-[#FBEB04] shadow-lg hover:bg-[#FBEB04]/80 hover:border-[#FBEB04] transition-all focus:outline-none focus:ring-2 focus:ring-[#FBEB04]"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6 text-[#272AE9]" strokeWidth={2} /> : <Menu className="h-6 w-6 text-[#272AE9]" strokeWidth={2} />}
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
                className="flex items-center gap-2 text-xl font-medium py-4 border-b border-gray-800 text-[#FBEB04]"
              >
                <h5>
                Home
                </h5>
              </Link>
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xl font-medium py-4 border-b border-gray-800 text-[#FBEB04]"
              >
                <h5>
                Community
                </h5>
              </Link>
              <Link
                to="/schedule"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xl font-medium py-4 border-b border-gray-800 text-[#FBEB04]"
              >
                <h5>
                Schedule
                </h5>
              </Link>
              <Link
                to="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-xl font-medium py-4 border-b border-gray-800 text-[#FBEB04]"
              >
                <h5>
                Gallery
                </h5>
              </Link>

                <Link
                to={publicKey ? "/profile" : "#"}
                onClick={e => {
                  if (!publicKey) {
                    e.preventDefault();
                    setShowConnectModal(true);
                  }
                  setMobileMenuOpen(false); // Always close the menu
                }}
                  className="flex items-center gap-2 text-xl font-medium py-4 border-b border-gray-800 text-[#FBEB04]"
                >
                  <h5>
                  Profile
                  </h5>
                </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


"use client"
import Hero from "./Hero"
import Tokenomics from "./Tokenomics"
import Faqs from "./Faqs"
import { Twitter, Send } from "lucide-react"
import TwitterFeed from "./XFeed"
import BoxBoxInterface from "./BoxBoxInterface"
import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { airtableService } from "../api/airtable"
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react"
import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor"
import { PublicKey } from "@solana/web3.js"
import idl from "../idl/boxbox.json"
import type { Boxbox } from "../types/boxbox"
import Loader from "./Loader"

import "@solana/wallet-adapter-react-ui/styles.css"
import WalletContextWrapper from "./WalletContextWrapper";



const idl_object = JSON.parse(JSON.stringify(idl))
export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()
  const { connection } = useConnection()
  
  // Debug logging
  console.log('AppPage - Wallet connected:', !!publicKey)
  console.log('AppPage - Public key:', publicKey?.toBase58())

  const getProvider = () => {
    if (!wallet) {
      // setMessageWithType("Wallet not connected.", "error")
      return null
    }
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
    setProvider(provider)
    return provider
  }

  // Get program instance
  const getProgram = () => {
    if (!publicKey) return null
    const provider = getProvider()
    return provider ? new Program<Boxbox>(idl_object, provider) : null
  }

  // Sync membership level to Airtable when user visits homepage
  useEffect(() => {
    const syncMembershipLevel = async () => {
      if (!publicKey) return
      
      try {
        const program = getProgram()
        if (!program) return

        // Add a small delay to ensure blockchain data is loaded
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Get user's membership account
        const [membershipAccountPda] = await PublicKey.findProgramAddress(
          [Buffer.from("membership_account"), publicKey.toBuffer()],
          program.programId,
        )

        // Check if membership account exists first
        const membershipAccountInfo = await connection.getAccountInfo(membershipAccountPda)
        if (!membershipAccountInfo) {
          console.log('Membership account does not exist, setting level to 0')
          // Only set to 0 if account truly doesn't exist
          try {
            const existingProfile = await airtableService.getProfile(publicKey.toBase58())
            await airtableService.upsertProfile({ 
              walletAddress: publicKey.toBase58(), 
              membershipLevel: 0,
              name: existingProfile?.name || "",
              email: existingProfile?.email || "",
              instagramUrl: existingProfile?.instagramUrl || "",
              tiktokUrl: existingProfile?.tiktokUrl || "",
              vkUrl: existingProfile?.vkUrl || "",
              profilePictureUrl: existingProfile?.profilePictureUrl || "",
              coverPictureUrl: existingProfile?.coverPictureUrl || "",
            })
            console.info('Membership account not found, set level to 0 in Airtable')
          } catch (profileError) {
            console.error('Failed to get existing profile:', profileError)
            // If we can't get the profile, just update the level without other fields
            await airtableService.upsertProfile({ 
              walletAddress: publicKey.toBase58(), 
              membershipLevel: 0,
              name: "",
              email: "",
              instagramUrl: "",
              tiktokUrl: "",
              vkUrl: "",
            })
          }
          return
        }

        // Fetch account info to get current level
        const accountInfo = await program.account.membershipAccount.fetch(membershipAccountPda)
        const currentLevel = accountInfo.level

        console.log('Current blockchain level:', currentLevel)

        // Get existing profile data from Airtable
        const existingProfile = await airtableService.getProfile(publicKey.toBase58())
        
        // Update Airtable with current level and existing profile data
        await airtableService.upsertProfile({ 
          walletAddress: publicKey.toBase58(), 
          membershipLevel: currentLevel,
          name: existingProfile?.name || "",
          email: existingProfile?.email || "",
          instagramUrl: existingProfile?.instagramUrl || "",
          tiktokUrl: existingProfile?.tiktokUrl || "",
          vkUrl: existingProfile?.vkUrl || "",
          profilePictureUrl: existingProfile?.profilePictureUrl || "",
          coverPictureUrl: existingProfile?.coverPictureUrl || "",
        })
        
        console.log('Membership level synced to Airtable:', currentLevel)
      } catch (error: any) {
        const errorMsg = String(error)
        if (errorMsg.includes('Account does not exist') || errorMsg.includes('has no data')) {
          // Handle gracefully: set level to 0
          try {
            const existingProfile = await airtableService.getProfile(publicKey.toBase58())
            await airtableService.upsertProfile({ 
              walletAddress: publicKey.toBase58(), 
              membershipLevel: 0,
              name: existingProfile?.name || "",
              email: existingProfile?.email || "",
              instagramUrl: existingProfile?.instagramUrl || "",
              tiktokUrl: existingProfile?.tiktokUrl || "",
              vkUrl: existingProfile?.vkUrl || "",
              profilePictureUrl: existingProfile?.profilePictureUrl || "",
              coverPictureUrl: existingProfile?.coverPictureUrl || "",
            })
            console.info('Membership account not found, set level to 0 in Airtable')
          } catch (profileError) {
            console.error('Failed to get existing profile:', profileError)
            // If we can't get the profile, just update the level without other fields
            await airtableService.upsertProfile({ 
              walletAddress: publicKey.toBase58(), 
              membershipLevel: 0,
              name: "",
              email: "",
              instagramUrl: "",
              tiktokUrl: "",
              vkUrl: "",
            })
          }
        } else {
          console.error('Failed to sync membership level:', error)
          // Don't set to 0 for other errors - just log them
        }
      }
    }

    if (publicKey) {
      // Add a delay to ensure wallet is fully connected
      const timer = setTimeout(() => {
        syncMembershipLevel()
      }, 2000) // Wait 2 seconds for wallet to fully connect

      return () => clearTimeout(timer)
    }
  }, [publicKey, connection])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full min-h-screen">
        <Loader />
      </div>
    )
  }

  return (
    <WalletContextWrapper>
    <div className="relative min-h-screen text-white font-sans overflow-hidden">
        {/* <BackgroundElements /> */}

        <main className="relative z-10">
          <section id="hero" className="w-full mb-8 sm:mb-16">
            <Hero />
          </section>

          <div className="relative z-10 w-full border-t-2 border-yellow-500/50 py-4 sm:py-8 mt-8 sm:mt-16" />

          <section id="interface" className="w-full backdrop-blur-xs">
            <div className="w-full px-1">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-4">
                  <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-yellow-500 bg-clip-text text-transparent mb-4 py-3">
                    BoxBox Web3 Membership
                  </h2>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Lock your BOXBOX tokens to participate in the F1 community and earn rewards.
                  </p>
                </div>
                <BoxBoxInterface />
              </div>
            </div>
          </section>

          <div className="relative z-10 w-full border-t-2 border-yellow-500/50 py-8 mt-16" />

          <section id="twitter-feed" className="w-full py-16 md:py-16">
            <TwitterFeed />
          </section>

          <div className="relative z-10 w-full border-t-2 border-yellow-500/50 py-8 mt-16" />

          <section id="tokenomics" className="w-full py-16 md:py-16">
            <Tokenomics />
          </section>

          <div className="relative z-10 w-full border-t-2 border-yellow-500/50 py-8 mt-16" />

          <section id="faqs" className="w-full py-16 md:py-16 z-100">
            <Faqs />
          </section>
        </main>

        <footer className="relative z-10 w-full border-t-2 border-yellow-500/50 py-4 sm:py-8 mt-8 sm:mt-16">
          <div className="w-full px-4 sm:px-6">
            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4">
                
                <div className="flex gap-6 justify-center items-center w-full">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-yellow-500">BOXBOX</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <a href="https://x.com/F1memeBoxbox" className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Twitter size={20} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Send size={20} />
                    </a>
                    <a href="https://solscan.io/token/A5D4sQ3gWgM7QHFRyo3ZavKa9jMjkfHSNR6rX5TNJB8y" className="text-gray-400 hover:text-yellow-500 transition-colors">
                      Solscan
                    </a>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} F1 Meme. All rights reserved.
              </p>

              <p className="text-[12px] text-gray-400 max-w-3xl text-center px-4">
                This is a meme project which is unofficial and is not associated in any way with the Formula 1 companies. 
                F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks 
                of Formula One Licensing B.V
              </p>
            </div>
          </div>
        </footer>
      </div>
      </WalletContextWrapper>
    )
}


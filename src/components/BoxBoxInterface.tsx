"use client"
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Program, AnchorProvider, utils, setProvider } from "@coral-xyz/anchor"
import { PublicKey } from "@solana/web3.js"
import idl from "../idl/boxbox.json"
import type { F1boxbox } from "../types/boxbox"
import BN from "bn.js"
import { LockIcon, UnlockIcon, ExternalLinkIcon, XIcon } from "lucide-react"
import { useAtom } from "jotai"
import { totalLockedTokensAtom } from "../atoms/totalLocked"
import { airtableService } from "../api/airtable"
import { useTranslation } from "../i18n/TranslationContext"

// interface MembershipAccount {
//   owner: PublicKey
//   locks: Array<{
//     amount: BN
//     releaseDate: BN
//     isLocked: boolean
//   }>
//   membershipBump: number
//   isInitialized: boolean
// }

// const programID = new PublicKey("AdMkR6N759U4gDR16XmGfScZJJoQAHsYmeo8RvXJJDch")
const tokenMint = new PublicKey("A5D4sQ3gWgM7QHFRyo3ZavKa9jMjkfHSNR6rX5TNJB8y")
const MAX_ACTIVE_VAULTS = 99
const idl_object = JSON.parse(JSON.stringify(idl))
let NUMBER_OF_TX: number
let unlockTokens: (arg0: number) => void
let checkMembershipAccount: () => void
let balance: number;

const formatNumber = (num: number): string => {
  // Split the number into whole and decimal parts
  const parts = num.toString().split('.');
  
  // Format the whole number part with commas
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  // Join back with decimal part if it exists
  return parts.join('.');
};

const TransactionLink = ({ signature }: { signature: string }) => (
  <a
    href={`https://solana.fm/tx/${signature}?cluster=mainnet-alpha`}
    target="_blank"
    rel="noreferrer noopener"
    className="inline-flex items-center text-gray-50 transition-colors"
  >
    View Transaction
    <ExternalLinkIcon className="ml-1 h-4 w-4" />
  </a>
)

const QUICKNODE_WS_URL = 'wss://winter-silent-lake.solana-mainnet.quiknode.pro/3e452fad7a2a3061d83b097d144b06b2e5230b2f/';

const BoxBoxInterface: React.FC = () => {
  const { t } = useTranslation()
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const { publicKey, sendTransaction } = useWallet()
  

  const [membershipAccount, setMembershipAccount] = useState<PublicKey | null>(null)
  const [escrowAccount, setEscrowAccount] = useState<PublicKey | null>(null)
  const [locks, setLocks] = useState<
    Array<{ id: number; amount: number; releaseDate: Date; isLocked: boolean; canUnlock: boolean }>
  >([])
  const [tokenBalance, setTokenBalance] = useState<number>(0)
  const [amountToLock, setAmountToLock] = useState<string>("")
  const [userLevel, setUserLevel] = useState<number>(0) // Add state for user level
  
  // Debug userLevel changes
  useEffect(() => {
    console.log('userLevel state changed to:', userLevel)
  }, [userLevel])
  
  // Debug membershipAccount changes
  useEffect(() => {
    console.log('membershipAccount state changed to:', membershipAccount?.toBase58() || 'null')
  }, [membershipAccount])
  
  const [isEscrowInitialized, setIsEscrowInitialized] = useState<boolean>(false) // Added escrow initialization state
  const [isMembershipInitialized, setIsMembershipInitialized] = useState<boolean>(false) // Added membership initialization state
  
  // Debug isMembershipInitialized changes
  useEffect(() => {
    console.log('isMembershipInitialized state changed to:', isMembershipInitialized)
  }, [isMembershipInitialized])
  const [showTooltip, setShowTooltip] = useState(false);

  const [messages, setMessages] = useState<Array<{ text: React.ReactNode; type: "success" | "error" | "info" }>>([])
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreatingMembership, setIsCreatingMembership] = useState(false);
  const [isCreatingVault, setIsCreatingVault] = useState(false);

  const [unlockingLockId, setUnlockingLockId] = useState<number | null>(null);
  const [totalLockedTokens, setTotalLockedTokens] = useAtom(totalLockedTokensAtom);

  const handleUnlockTokens = async (lockIndex: number) => {
    try {
      setUnlockingLockId(lockIndex);
      
      await unlockTokens(lockIndex);
      
      setTimeout(() => {
        setUnlockingLockId(null);
      }, 3000);
      
    } catch (err) {
      console.error("Error unlocking tokens:", err);
      setUnlockingLockId(null);
    }
  };

  const handleLockTokens = async () => {
    if (isProcessing) return; // Prevent multiple clicks
    setIsProcessing(true);

    try {
      await lockTokens(); // Call the original function
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsProcessing(false); // Re-enable the button
    }
  };


  let membershipAccountPda: PublicKey, escrowTokenAccountPda: PublicKey

  const clearMessage = (index: number) => {
    setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index))
  }

  const setMessageWithType = (text: React.ReactNode, type: "success" | "error" | "info", signature?: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: (
          <>
            {text}
            {signature && <TransactionLink signature={signature} />}
          </>
        ),
        type,
      },
    ])
    // Automatically remove the message after 5 seconds
    setTimeout(() => {
      setMessages((prevMessages) => prevMessages.slice(1));
    }, 5000);
  }

  const getProvider = () => {
    if (!wallet) {
      // setMessageWithType("Wallet not connected.", "error")
      return null
    }
    const provider = new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions())
    setProvider(provider)
    return provider
  }

  const getProgram = () => {
    const provider = getProvider()
    return provider ? new Program<F1boxbox>(idl_object, provider) : null
  }

  const setupProgramSubscription = useCallback(async () => {
    const ws = new WebSocket(QUICKNODE_WS_URL);
    let retryCount = 0;
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds

    // Function to send subscription request
    const sendSubscriptionRequest = (ws: WebSocket) => {
        const subscribeMessage = {
            jsonrpc: "2.0",
            id: 1,
            method: "programSubscribe",
            params: [
                "5wsriCThJpgx5iMqpQ1fqNC33FCetYhF3d24Wzg5ceHH",
                {
                    encoding: "jsonParsed",
                    commitment: "confirmed"
                }
            ]
        };
        ws.send(JSON.stringify(subscribeMessage));
    };

    let pingInterval: NodeJS.Timeout;

    ws.onopen = () => {
        retryCount = 0;
        sendSubscriptionRequest(ws);
        
        // QuickNode doesn't require ping/pong, but we'll keep a longer interval just in case
        pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ jsonrpc: "2.0", method: "ping" }));
            }
        }, 45000);

        updateTotalLockedTokens();
    };

    ws.onmessage = async (event) => {
        try {
            const response = JSON.parse(event.data);
            
            // Handle rate limit error
            if (response.error && response.error.code === 429) {
                console.log('Rate limit hit, implementing backoff...');
                // Immediately update local total even during rate limit
                await updateTotalLockedTokens();
                
                if (retryCount < MAX_RETRIES) {
                    retryCount++;
                    const delay = RETRY_DELAY * Math.pow(2, retryCount - 1); // Exponential backoff
                    setTimeout(() => {
                        if (ws.readyState === WebSocket.OPEN) {
                            sendSubscriptionRequest(ws);
                        }
                    }, delay);
                } else {
                    console.error('Max retries reached, falling back to polling');
                    // Fall back to polling with shorter interval
                    const pollInterval = setInterval(async () => {
                        await updateTotalLockedTokens();
                    }, 5000); // Poll every 5 seconds instead of 10
                    
                    // Clear polling after 5 minutes
                    setTimeout(() => {
                        clearInterval(pollInterval);
                        retryCount = 0;
                    }, 300000);
                }
                return;
            }

            if (response.method === "programNotification" || 
                (response.result && response.result.value)) {
                // console.log('Received update, refreshing totals');
                await updateTotalLockedTokens();
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
            // Update local total even if there's an error processing the message
        }
    };

    // ws.onerror = (error) => {
    //     console.error('WebSocket Error:', error);
    //     if (retryCount < MAX_RETRIES) {
    //         retryCount++;
    //         const delay = RETRY_DELAY * Math.pow(2, retryCount - 1);
    //         setTimeout(() => {
    //             if (ws.readyState === WebSocket.CLOSED) {
    //                 setupProgramSubscription();
    //             }
    //         }, delay);
    //     }
    // };

    // ws.onclose = () => {
    //     console.log('WebSocket Disconnected');
    //     if (pingInterval) {
    //         clearInterval(pingInterval);
    //     }
    //     if (retryCount < MAX_RETRIES) {
    //         retryCount++;
    //         const delay = RETRY_DELAY * Math.pow(2, retryCount - 1);
    //         setTimeout(() => {
    //             setupProgramSubscription();
    //         }, delay);
    //     }
    // };

    return () => {
        if (pingInterval) {
            clearInterval(pingInterval);
        }
        if (ws.readyState === WebSocket.OPEN) {
            ws.close();
        }
    };
}, []);

// Update the useEffect to properly handle the WebSocket subscription
useEffect(() => {
    let cleanup: Promise<() => void> | undefined;
    
    if (publicKey) {
        cleanup = setupProgramSubscription();
    }

    return () => {
        if (cleanup) {
            cleanup.then(cleanupFn => cleanupFn());
        }
    };
}, [publicKey, setupProgramSubscription]);

useEffect(() => {
    if (wallet) {  // Only run when wallet is connected
        const program = getProgram();
        if (program) {
            program.account.membershipAccount.all()
                .then(accounts => {
                    const total = accounts.reduce((sum: number, account: any) => {
                        const lockedAmount = account.account.locks
                            .filter((lock: any) => lock.isLocked)
                            .reduce((lockSum: number, lock: any) => {
                                // console.log('Lock amount:', lock.amount.toNumber() / 1e6);
                                return lockSum + lock.amount.toNumber();
                            }, 0);
                        return sum + lockedAmount;
                    }, 0);
                    setTotalLockedTokens(total / 1e6);
                })
                .catch(console.error);
        }
    }
}, [wallet]); // Re-run when wallet changes

  useEffect(() => {
    if (publicKey) {
      console.log('useEffect[publicKey]: Starting initialization for wallet:', publicKey.toBase58())
      checkMembershipAccount()
      fetchTokenBalance()
      const fetchData = async () => {
        console.log('useEffect[publicKey]: Running periodic fetchData')
        checkMembershipAccount()
        await fetchTokenBalance()
      }

      fetchData()
      const interval = setInterval(fetchData, 5000)

      return () => clearInterval(interval)
    }
  }, [publicKey])

  checkMembershipAccount = async () => {
    const program = getProgram()

    if (!program || !wallet?.publicKey) {
      console.log('checkMembershipAccount: Missing program or wallet publicKey')
      return
    }

    try {
        ;[membershipAccountPda] = PublicKey.findProgramAddressSync(
          [Buffer.from("membership_account"), wallet.publicKey.toBuffer()],
          program.programId,
        )
      console.log('checkMembershipAccount: Generated membershipAccountPda:', membershipAccountPda.toBase58())
      
      // Check if membership account exists
      const membershipAccountInfo = await connection.getAccountInfo(membershipAccountPda)
      console.log('checkMembershipAccount: Membership account exists:', !!membershipAccountInfo)
      
      if (membershipAccountInfo) {
        console.log('checkMembershipAccount: Setting membership account')
        setMembershipAccount(membershipAccountPda)
        setIsMembershipInitialized(true)
        console.log('checkMembershipAccount: Set isMembershipInitialized to true')
      } else {
        console.log('checkMembershipAccount: Membership account does not exist yet')
        setMembershipAccount(null)
        setIsMembershipInitialized(false)
        console.log('checkMembershipAccount: Set isMembershipInitialized to false')
      }

      escrowTokenAccountPda = await utils.token.associatedAddress({
        mint: tokenMint,
        owner: membershipAccountPda,
      })

      const escrowAccountInfo = await connection.getAccountInfo(escrowTokenAccountPda)
      console.log('checkMembershipAccount: Escrow account exists:', !!escrowAccountInfo)
      if (!escrowAccountInfo) {
        setIsEscrowInitialized(false)
      }
      else {
        setIsEscrowInitialized(true)
      }

      updateAccountInfo()
    } catch (error) {
      console.error('checkMembershipAccount: Error:', error)
      if (!error?.toString().includes("failed to get info about account")) {
        setMessageWithType(`${t.messages.errorCheckingMembershipAccount} ${error}`, "error")
      }
    }
  }

  const initializeMembershipAccount = async () => {
    const program = getProgram()

    if (!program || !wallet?.publicKey || isCreatingMembership) return

    setIsCreatingMembership(true)

    try {
      balance = await connection.getBalance(wallet.publicKey)
      // console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

      if (balance < 0.00016) {
        setMessageWithType(t.messages.needSolForAccount, "info")
        setIsCreatingMembership(false)
        return
      }

        ;[membershipAccountPda] = await PublicKey.findProgramAddressSync(
          [Buffer.from("membership_account"), wallet.publicKey.toBuffer()],
          program.programId,
        )
        console.log('membershipAccountPdaMembershipAccount: ', membershipAccountPda);

      const membershipAccountInfo = await connection.getAccountInfo(membershipAccountPda)
      if (!membershipAccountInfo) {
        const tx = await program.methods
          .initializeMembershipAccount()
          .accounts({
            owner: wallet.publicKey,
          })
          .transaction()

        await sendTransaction(tx, connection)

        // Wait 5 seconds to ensure the account is fully created on the blockchain
        await new Promise(resolve => setTimeout(resolve, 5000))
        
        // Verify the account exists before marking as initialized
        const verifyInfo = await connection.getAccountInfo(membershipAccountPda)
        if (verifyInfo) {
          setMembershipAccount(membershipAccountPda)
          setIsMembershipInitialized(true)
          
          // Update account info and sync membership level to DB
          await updateAccountInfo()
        }
      } else {
        setMembershipAccount(membershipAccountPda)
        setIsMembershipInitialized(true)
      }
    } catch (error) {
      if (error?.toString().includes("User rejected the request")) {
        setMessageWithType(t.messages.rejectedCreateAccount, "error")
      }
      else if (!error?.toString().includes("failed to get info about account")) {
        setMessageWithType(`${t.messages.errorCreatingAccount} ${error}`, "error")
      }
    } finally {
      setIsCreatingMembership(false)
    }
    // updateAccountInfo()
  }

  const initializeEscrowAccount = async () => {
    const program = getProgram()

    if (!program || !wallet?.publicKey || isCreatingVault) return

    setIsCreatingVault(true)

    try {
      balance = await connection.getBalance(wallet.publicKey)
      if (balance < 0.00016) {
        setMessageWithType(t.messages.needSolForVault, "info")
        setIsCreatingVault(false)
        return
      }

        ;[membershipAccountPda] = await PublicKey.findProgramAddressSync(
          [Buffer.from("membership_account"), wallet.publicKey.toBuffer()],
          program.programId,
        )
        console.log('membershipAccountPdaEscrowAccount: ', membershipAccountPda);
        setMembershipAccount(membershipAccountPda)

        escrowTokenAccountPda = await utils.token.associatedAddress({
          mint: tokenMint,
          owner: membershipAccountPda,
        })

        const escrowAccountInfo = await connection.getAccountInfo(escrowTokenAccountPda)
        
        if (!escrowAccountInfo) {
            const tx = await program.methods
              .initializeEscrowAccount()
              .accountsPartial({
                owner: wallet.publicKey,
                mint: tokenMint,
                membershipAccount: membershipAccountPda,
                tokenProgram: utils.token.TOKEN_PROGRAM_ID,
              })
              .transaction()

            // Send and confirm the transaction
            const signature = await sendTransaction(tx, connection)
            
            // Wait for confirmation
            const confirmation = await connection.confirmTransaction(signature, 'confirmed')
            
            if (confirmation.value.err) {
                throw new Error('Transaction failed to confirm')
            }

            // Wait 5 seconds to ensure the vault is fully created on the blockchain
            await new Promise(resolve => setTimeout(resolve, 5000))
            
            // Verify the vault exists before marking as initialized
            const verifyVaultInfo = await connection.getAccountInfo(escrowTokenAccountPda)
            if (verifyVaultInfo) {
              setEscrowAccount(escrowTokenAccountPda)
              setIsEscrowInitialized(true)
            }
            // setMessageWithType(t.messages.vaultCreated, "success", signature)
        } else {
            setEscrowAccount(escrowTokenAccountPda)
            setIsEscrowInitialized(true)
        }
    } catch (error) {
        if (error?.toString().includes("User rejected the request")) {
            setMessageWithType(t.messages.rejectedCreateVault, "error")
        } else if (error?.toString().includes("blockhash not found")) {
            setMessageWithType(t.messages.transactionExpired, "error")
        } else if (!error?.toString().includes("failed to get info about account")) {
            setMessageWithType(`${t.messages.errorCreatingVault} ${error}`, "error")
        }
    } finally {
      setIsCreatingVault(false)
    }
  }

  const updateAccountInfo = async () => {
    const program = getProgram()
    if (!program || !membershipAccount) {
      console.log('updateAccountInfo: Missing program or membershipAccount', { 
        hasProgram: !!program, 
        hasMembershipAccount: !!membershipAccount,
        membershipAccountAddress: membershipAccount?.toBase58()
      })
      return
    }

    try {
      console.log('updateAccountInfo: Fetching account info for:', membershipAccount.toBase58())
      const accountInfo = await program.account.membershipAccount.fetch(membershipAccount)
      console.log('updateAccountInfo: Raw account info:', accountInfo)
      console.log('updateAccountInfo: Account level:', accountInfo.level)

      const currentTime = new Date()
      setLocks(
        accountInfo.locks.map((lock: any, index: number) => ({
          id: index,
          amount: lock.amount.toNumber() / 1e6,
          releaseDate: new Date(lock.releaseDate.toNumber() * 1000),
          isLocked: lock.isLocked,
          canUnlock: lock.isLocked && currentTime >= new Date(lock.releaseDate.toNumber() * 1000),
        })),
      )
      console.log('updateAccountInfo: Setting user level to:', accountInfo.level)
      setUserLevel(accountInfo.level) // Update user level
    } catch (error) {
      console.error('updateAccountInfo: Error fetching account info:', error)
      setMessageWithType(`${t.messages.errorFetchingAccountInfo} ${error}`, "error")
    }
  }

  const fetchTokenBalance = async () => {
    if (!wallet?.publicKey) return
    try {
      const userATA = await utils.token.associatedAddress({
        mint: tokenMint,
        owner: wallet.publicKey,
      })
      const balance = await connection.getTokenAccountBalance(userATA)
      setTokenBalance(balance.value.uiAmount || 0)
      updateAccountInfo()
    }
    catch {
      // setMessageWithType("You don't have any BOXBOX tokens. Purchase some at boxbox.wtf", "info")
    }
  }

  const lockTokens = async () => {
    const program = getProgram()
    if (!program || !wallet?.publicKey) return

    if (balance < 0.00016) return setMessageWithType(t.messages.needSolForTransactions, "info")

    try {
      // Check if membership account has been created
      if (!isMembershipInitialized) {
        setMessageWithType(t.messages.needCreateMembershipAccount, "error")
        return
      }

      // Check if escrow account has been created
      if (!isEscrowInitialized) {
        setMessageWithType(t.messages.needCreateEscrowAccount, "error")
        return
      }

      NUMBER_OF_TX = locks.length
      if (NUMBER_OF_TX == MAX_ACTIVE_VAULTS) {
        setMessageWithType(t.messages.cannotHaveMoreThan99Transactions, "error")
        return
      }

      const amountToLockBN = new BN(Math.floor(Number.parseFloat(amountToLock) * 1e6).toString())



      // ---------- START OF RELEASE DATE LOGIC FOR 13:00() the next day ------------
      // Get the current time in UTC
      // const now = new Date();

      // // Get Singapore time (UTC+8) at 13:00 the next day
      // const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 5, 0, 0, 0)); // 13:00 SGT is 05:00 UTC

      // // Convert to UNIX timestamp (seconds)
      // const releaseTimestamp = Math.floor(tomorrow.getTime() / 1000);

      // // Convert to BN
      // const releaseDate = new BN(releaseTimestamp);

      // console.log(releaseDate.toString()); // Output the timestamp

      // ---------- END OF RELEASE DATE LOGIC FOR 13:00(SINGAPORE) the next day ------------


      // ---------- START OF RELEASE DATE LOGIC FOR 13:00 DEC 8TH 2025 the next day ------------

      // const now = new Date();

      // // Set December 8th, 2025, 13:00 SGT (UTC+8)
      // const targetDate = new Date(Date.UTC(2025, 11, 8, 5, 0, 0, 0)); // 13:00 SGT is 05:00 UTC

      // // Convert to UNIX timestamp (seconds)
      // const releaseTimestamp = Math.floor(targetDate.getTime() / 1000);

      // // Convert to BN
      // const releaseDate = new BN(releaseTimestamp);


      // ---------- END OF RELEASE DATE LOGIC FOR 13:00(SINGAPORE) the next day ------------
      // ---------- START OF RELEASE DATE LOGIC FOR NEXT 2 MINUTES ------------

      // Get current time in milliseconds
      // const now = new Date()

      // // Calculate the time 2 minutes from now
      // const releaseTime = new Date(now.getTime() + 1 * 60 * 1000) // Add 3 minutes

      // // Convert to seconds (UNIX timestamp)
      // const releaseTimestamp = Math.floor(releaseTime.getTime() / 1000)

      // // Convert to BN
      // const releaseDate = new BN(releaseTimestamp)

      // ---------- END OF RELEASE DATE LOGIC FOR NEXT 2 MINUTES ------------


      // const userATA = await utils.token.associatedAddress({
      //   mint: tokenMint,
      //   owner: wallet.publicKey,
      // })

      if (Number(amountToLock) > tokenBalance && tokenBalance !== 0) {
        setMessageWithType(t.messages.insufficientBalance, "error")
        return
      }
      if (tokenBalance === 0) {
        setMessageWithType(t.messages.noBoxboxTokens, "info")
        return
      }

      // console.log('bro');

      const tx = await program.methods
        .lockTokens(amountToLockBN)
        .accountsPartial({
          owner: wallet.publicKey,
          membershipAccount: membershipAccountPda,
          mint: tokenMint,
          // memberTokenAccount: userATA,
          escrowTokenAccount: escrowTokenAccountPda,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        })
        .transaction()

      const transactionSignature = await sendTransaction(tx, connection)

      // Wait for transaction confirmation
      await connection.confirmTransaction(transactionSignature)
      
      setMessageWithType(t.messages.tokensLockedSuccessfully, "success", transactionSignature)
      
      // Update totals after successful lock
      await updateTotalLockedTokens()
      
      await updateAccountInfo()
      await fetchTokenBalance()
      setAmountToLock("")
      
    } catch (error) {
      if (error?.toString().includes("User rejected the request")) {
        setMessageWithType(t.messages.rejectedLockTokens, "error")
      }
      else if (!error?.toString().includes("failed to get info about account")) {
        setMessageWithType(`${t.messages.errorLockingTokens} ${error}`, "error")
      }
    }
  }

  unlockTokens = async (lockIndex: number) => {
    const program = getProgram()
    if (!program || !wallet?.publicKey || !membershipAccount || !escrowAccount) return

    const lock = locks.find((lock) => lock.id === lockIndex)
    // console.log('vault details: ', lock);
    
    if (!lock || !lock.isLocked) {
      setMessageWithType(t.messages.lockNotActive, "error")
      return
    }
    if (!lock.isLocked) {
      setMessageWithType(t.messages.tokensAlreadyUnlocked, "info")
      return
    }

    if (!lock.canUnlock) {
      setMessageWithType(`${t.messages.tokensStillLocked} ${lock.releaseDate.toLocaleString()}`, "info")
      return
    }

    try {
      const tx = await program.methods
        .unlockTokens(lockIndex)
        .accountsPartial({
          owner: wallet.publicKey,
          membershipAccount: membershipAccountPda,
          mint: tokenMint,
          memberTokenAccount: await utils.token.associatedAddress({
            mint: tokenMint,
            owner: wallet.publicKey,
          }),
          // escrowTokenAccount: escrowAccount,
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
        })
        .transaction()

      const transactionSignature = await sendTransaction(tx, connection)

      // Wait for transaction confirmation
      await connection.confirmTransaction(transactionSignature)
      
      setMessageWithType(t.messages.tokensUnlockedSuccessfully, "success", transactionSignature)
      
      // Update totals after successful unlock
      await updateTotalLockedTokens()
      
      setLocks((prevLocks) => {
        const updatedLocks = prevLocks.map((l) => (l.id === lockIndex ? { ...l, isLocked: false } : l))
        if (updatedLocks.every((lock) => !lock.isLocked)) {
          setTimeout(() => window.location.reload(), 1000)
        }
        return updatedLocks
      })

      await updateAccountInfo()
      await fetchTokenBalance()
    } catch (error) {
      if (error?.toString().includes("User rejected the request.")) {
        setMessageWithType(t.messages.rejectedUnlockTokens, "error")
      }
      else if (!error?.toString().includes("failed to get info about account")) {
        setMessageWithType(`${t.messages.errorUnlockingTokens} ${error}`, "error")
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLocks((prevLocks) => {
        const currentTime = new Date()
        return prevLocks.map((lock: any) => ({
          ...lock,
          canUnlock: lock.isLocked && currentTime >= lock.releaseDate,
        }))
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        setMessages((prevMessages) => prevMessages.slice(1))
      }, 12000)
      return () => clearTimeout(timer)
    }
  }, [messages])

  useEffect(() => {
    const savedSignature = localStorage.getItem("lastTransactionSignature")
    if (savedSignature) {
      setMessageWithType(
        <>
          <TransactionLink signature={savedSignature} />
        </>,
        "success",
      )
      localStorage.removeItem("lastTransactionSignature")
    }
  }, []) // Removed unnecessary 'message' dependency

  //Dummy LevelDisplay Component
  const LevelDisplay = ({ level }: { level: number }) => {
    console.log('LevelDisplay: Received level:', level, 'Type:', typeof level)
    return (
      <div className="flex justify-center items-center mb-4 gap-4">
        <span className="text-gray-400 font-bold">{t.additional.membershipLevel}</span>
        <h6 className="text-xl font-semibold">{level}</h6>
      </div>
    )
  }

  // Add a new function to update total locked tokens
  const updateTotalLockedTokens = async () => {
    const program = getProgram();
    if (program) {
        try {
            // console.log('Fetching all membership accounts...');
            const accounts = await program.account.membershipAccount.all();
            // console.log('Found accounts:', accounts.length);
            
            const total = accounts.reduce((sum: number, account: any) => {
                const lockedAmount = account.account.locks
                    .filter((lock: any) => lock.isLocked)
                    .reduce((lockSum: number, lock: any) => {
                        // console.log('Lock amount:', lock.amount.toNumber() / 1e6);
                        return lockSum + lock.amount.toNumber();
                    }, 0);
                return sum + lockedAmount;
            }, 0);
            
            const finalTotal = total / 1e6;
            // console.log('New total:', finalTotal);
            
            // Force a state update by creating a new number
            setTotalLockedTokens(prevTotal => {
                // console.log('Previous total:', prevTotal);
                if (prevTotal !== finalTotal) {
                    // console.log('Updating total to:', finalTotal);
                    return finalTotal;
                }
                return prevTotal;
            });
        } catch (error) {
            console.error('Error updating total locked tokens:', error);
        }
    }
  };

  // Add this effect to update totals after successful transactions
  useEffect(() => {
    if (wallet) {
        // Update total after any lock/unlock operation
        const updateAfterTransaction = async () => {
            await updateTotalLockedTokens();
        };
        
        // Create a subscription for transaction confirmations
        const subscriptionId = connection.onAccountChange(
            new PublicKey("5wsriCThJpgx5iMqpQ1fqNC33FCetYhF3d24Wzg5ceHH"), // Replace with your program ID
            async () => {
                await updateAfterTransaction();
            },
            'confirmed'
        );

        // Cleanup subscription when component unmounts
        return () => {
            connection.removeAccountChangeListener(subscriptionId);
        };
    }
  }, [wallet, connection]);

  // Add this useEffect for backup polling
  useEffect(() => {
    if (wallet) {
        // Poll every 10 seconds as a backup
        const pollInterval = setInterval(async () => {
            await updateTotalLockedTokens();
        }, 10000);

        return () => clearInterval(pollInterval);
    }
  }, [wallet]);

  // Sync membership level to Airtable when userLevel changes
  useEffect(() => {
    if (publicKey && typeof userLevel === 'number') {
      const syncLevel = async () => {
        try {
          // Add a small delay to ensure data is stable
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Only sync if userLevel is greater than 0 or if we're sure it should be 0
          if (userLevel > 0 || (userLevel === 0 && isMembershipInitialized)) {
            // Get existing profile data from Airtable
            const existingProfile = await airtableService.getProfile(publicKey.toBase58())
            
            // Only update if we have existing profile data to preserve
            if (existingProfile) {
              await airtableService.upsertProfile({ 
                walletAddress: publicKey.toBase58(), 
                membershipLevel: userLevel,
                name: existingProfile.name || "",
                email: existingProfile.email || "",
                instagramUrl: existingProfile.instagramUrl || "",
                tiktokUrl: existingProfile.tiktokUrl || "",
                profilePictureUrl: existingProfile.profilePictureUrl || "",
                coverPictureUrl: existingProfile.coverPictureUrl || "",
                tgUrl: "",
              })
            } else {
              // If no existing profile, just update the level without other fields
              await airtableService.upsertProfile({ 
                walletAddress: publicKey.toBase58(), 
                membershipLevel: userLevel,
                name: "",
                email: "",
                instagramUrl: "",
                tiktokUrl: "",
                tgUrl: "",
              })
            }
            // console.log('Membership level synced to Airtable:', userLevel)
          }
        } catch (err) {
          console.error('Failed to sync membership level to Airtable:', err)
        }
      }
      
      syncLevel()
    }
  }, [publicKey, userLevel, isMembershipInitialized])

  return (
    <div className="flex flex-col items-center justify-start text-white">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Total locked tokens display section */}
        <div className="text-center mb-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto transform transition-all duration-300 hover:bg-black/30">
            {wallet ? (
              <>
                <h3 className="text-yellow-400 text-lg sm:text-xl md:text-xl font-bold mb-3 tracking-tight">
                  {t.additional.totalBoxboxLocked}
                </h3>
                <div className="flex flex-col items-center space-y-1">
                  <p className="text-xl sm:text-3xl md:text-3xl font-bold text-gray-50 tracking-wider">
                    {formatNumber(totalLockedTokens)}
                  </p>
                  {/* <p className="text-yellow-500/80 text-sm sm:text-base uppercase tracking-widest font-medium">
                    BOXBOX
                  </p> */}
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-lg sm:text-xl font-medium leading-relaxed whitespace-pre-line">
                {t.additional.connectWalletToView}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-t-xl p-3 sm:p-4 mb-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <h3 className="text-xl sm:text-2xl font-bold text-yellow-500 text-center sm:text-left">{t.additional.boxboxPremium}</h3>
          <div className="flex items-center w-full sm:w-auto justify-center sm:justify-end">
            <WalletMultiButton className="w-full sm:w-auto" />
          </div>
        </div>


        {/* Remove bg-[#24252d] from messages */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`px-3 sm:px-4 py-2 flex justify-between items-center mb-3 sm:mb-4 ${
              message.type === "error" ? "bg-red-600/50" : message.type === "info" ? "bg-blue-600/50" : "bg-green-600/50"
            } backdrop-blur-sm rounded-md`}
          >
            <p className="text-sm sm:text-base">{message.text}</p>
            <button
              onClick={() => clearMessage(index)}
              className="text-white hover:font-bold bg-transparent transition duration-150 ease-in-out ml-2"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ))}

        {wallet && (
          <div className="rounded-b-xl shadow-lg w-full overflow-hidden">
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <LevelDisplay level={userLevel} />
                
                {/* Stats Grid - 2 columns on mobile, 3 on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="backdrop-blur-sm bg-black/20 p-4 rounded-lg">
                    <span className="text-gray-400 font-bold text-sm">{t.additional.tokenBalance}</span>
                    <h6 className="text-base font-semibold block mt-1">{formatNumber(tokenBalance)} BOXBOX</h6>
                  </div>
                  <div className="backdrop-blur-sm bg-black/20 p-4 rounded-lg">
                    <span className="text-gray-400 font-bold text-sm">{t.additional.membershipAccount}</span>
                    <h6 className="text-base font-semibold block mt-1">
                      {isMembershipInitialized ? t.additional.created : t.additional.yetToBeCreated}
                    </h6>
                    {!isMembershipInitialized && (
                      <button
                        onClick={initializeMembershipAccount}
                        disabled={isCreatingMembership || isProcessing}
                        className="mt-2 w-full py-2 px-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md text-sm font-medium transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isCreatingMembership ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-700 border-t-transparent"></div>
                            <span>Creating...</span>
                          </>
                        ) : (
                          t.additional.createAccount
                        )}
                      </button>
                    )}
                  </div>
                  <div className="backdrop-blur-sm bg-black/20 p-4 rounded-lg relative">
                    <span className="text-gray-400 font-bold text-sm">
                      {t.additional.vault}
                      <i
                        className="fas fa-info-circle text-blue-400 ml-1 cursor-pointer"
                        onClick={() => setShowTooltip(!showTooltip)}
                        onMouseEnter={() => window.innerWidth > 768 && setShowTooltip(true)}
                        onMouseLeave={() => window.innerWidth > 768 && setShowTooltip(false)}
                      ></i>
                    </span>
                    <h6 className="text-base font-semibold block mt-1">
                      {isEscrowInitialized ? t.additional.created : t.additional.yetToBeCreated}
                    </h6>
                    {!isEscrowInitialized && (
                      <button
                        onClick={initializeEscrowAccount}
                        disabled={isCreatingVault || isProcessing || !isMembershipInitialized}
                        className="mt-2 w-full py-2 px-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-md text-sm font-medium transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isCreatingVault ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-700 border-t-transparent"></div>
                            <span>Creating...</span>
                          </>
                        ) : (
                          t.additional.createVault
                        )}
                      </button>
                    )}
                    {showTooltip && (
                      <span className="absolute left-0 -top-16 w-64 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-10">
                        {t.additional.vaultTooltip}
                      </span>
                    )}
                  </div>
                </div>

                {/* Lock Tokens Section */}
                <div className="space-y-4 bg-[#1a1b23] p-4 sm:p-6 rounded-lg mt-6">
                  <div>
                    <label htmlFor="amountToLock" className="block text-sm font-medium text-gray-400 mb-3 text-center">
                      {t.additional.amountToLock}
                    </label>
                    <div className="relative flex items-center">
                      <button
                        type="button"
                        onClick={() => setAmountToLock((prev) => (Math.max(0, Number(prev) - 100)).toString())}
                        className="absolute left-2 bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition"
                      >
                        ▼
                      </button>
                      <input
                        type="text"
                        id="amountToLock"
                        value={amountToLock ? formatNumber(Number(amountToLock)) : ""}
                        onChange={(e) => {
                          // Remove all non-numeric characters before setting the value
                          const numericValue = e.target.value.replace(/[^0-9]/g, '');
                          setAmountToLock(numericValue);
                        }}
                        min="0"
                        max={tokenBalance.toString()}
                        step="100"
                        className="w-full px-14 py-3 bg-[#24252d] rounded-md border border-gray-600 text-white text-center text-lg focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                      />
                      <button
                        type="button"
                        onClick={() => setAmountToLock((prev) => Math.min(tokenBalance, Number(prev) + 100).toString())}
                        className="absolute right-2 bg-gray-700 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition"
                      >
                        ▲
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={handleLockTokens}
                    disabled={
                      isProcessing || !amountToLock || Number.parseFloat(amountToLock) <= 0 || NUMBER_OF_TX === MAX_ACTIVE_VAULTS
                    }
                    className={`w-full py-4 rounded-md flex items-center justify-center transition-colors text-lg font-semibold ${
                      isProcessing || !amountToLock || Number.parseFloat(amountToLock) <= 0 || NUMBER_OF_TX === MAX_ACTIVE_VAULTS
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-400 text-black"
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <p>{t.additional.processing}</p>
                      </div>
                    ) : (
                      <>
                        <LockIcon className="mr-2 h-5 w-5" />
                        {t.additional.lockTokens}
                      </>
                    )}
                  </button>
                </div>

                {/* Active Locks Section */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-center">{t.additional.activeLocks}</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {locks.filter((lock) => lock.isLocked).length === 0 ? (
                      <p className="text-gray-400 col-span-full text-center">{t.additional.noActiveLocks}</p>
                    ) : (
                      locks
                        .filter((lock) => lock.isLocked)
                        .map((lock) => (
                          <div key={lock.id} className="bg-[#1a1b23] p-4 rounded-lg">
                            <div className="space-y-3">
                              <div className="text-center">
                                <span className="text-gray-400 text-sm">{t.additional.lockedAmount}</span>
                                <span className="text-lg sm:text-xl font-semibold block mt-1">{formatNumber(lock.amount)} BOXBOX</span>
                              </div>
                              <div className="text-center">
                                <span className="text-gray-400 text-sm">{t.additional.releaseDate}</span>
                                <span className="text-base block mt-1">{lock.releaseDate.toLocaleString()}</span>
                              </div>
                              <button
                                onClick={() => handleUnlockTokens(lock.id)}
                                disabled={unlockingLockId === lock.id || !lock.canUnlock}
                                className={`w-full py-3 rounded-md flex items-center justify-center transition-colors ${
                                  unlockingLockId === lock.id || !lock.canUnlock
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                                }`}
                              >
                                <div className="flex items-center">
                                  {unlockingLockId === lock.id ? (
                                    <p>{t.additional.unlocking}</p>
                                  ) : lock.canUnlock ? (
                                    <>
                                      <UnlockIcon className="mr-2 h-5 w-5" />
                                      <p>{t.additional.unlockTokens}</p>
                                    </>
                                  ) : (
                                    <>
                                      <LockIcon className="mr-2 h-5 w-5" />
                                      <p>{t.additional.locked}</p>
                                    </>
                                  )}
                                </div>
                              </button>
                              <small className="text-gray-50 text-xs block mt-2 text-center font-medium">
                                {t.additional.keepSolForGas}
                              </small>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Unlocked Tokens Section */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-center">{t.additional.unlockedTokens}</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {locks.filter((lock) => !lock.isLocked).length === 0 ? (
                      <p className="text-gray-400 col-span-full text-center">{t.additional.noUnlockedTokens}</p>
                    ) : (
                      locks
                        .filter((lock) => !lock.isLocked)
                        .map((lock) => (
                          <div key={lock.id} className="bg-[#1a1b23] p-4 rounded-lg">
                            <div className="text-center">
                              <span className="text-gray-400 text-sm">{t.additional.unlockedAmount}</span>
                              <span className="text-lg sm:text-xl font-semibold block mt-1">{formatNumber(lock.amount)} BOXBOX</span>
                            </div>
                            <div className="mt-3 text-center">
                              <span className="text-gray-400 text-sm">{t.additional.unlockedDate}</span>
                              <span className="text-base block mt-1">{lock.releaseDate.toLocaleString()}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Not Connected State */}
        {!wallet && (
          <div className="backdrop-blur-sm bg-black/20 rounded-b-xl shadow-lg w-full overflow-hidden p-6 text-center">
            <p className="text-lg sm:text-xl font-medium text-gray-300 mb-3 text-center">
              {typeof window !== 'undefined' && window.innerWidth <= 768 ? (
                <span>{t.additional.openWithPhantom}</span>
              ) : (
                <span>{t.additional.connectWalletToLock}</span>
              )}
            </p>
            <small className="text-sm text-gray-400 max-w-lg mx-auto block text-center">
              {t.additional.firstConnectionInfo}
            </small>
          </div>
        )}
      </div>
    </div>
  )
}

export default BoxBoxInterface

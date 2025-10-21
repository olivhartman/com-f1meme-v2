/**
 * Admin utility functions
 */

// Admin wallet address - update this to match your admin wallet
export const ADMIN_WALLET_ADDRESS = "G14s2hZVZQqcUfLYSEdTThNqgZCi4pqM2P2RmRiu2ddz";

/**
 * Check if a wallet address belongs to an admin
 * @param walletAddress - The wallet address to check
 * @returns true if the address belongs to an admin
 */
export const isAdminWallet = (walletAddress: string | null | undefined): boolean => {
  if (!walletAddress) return false;
  return walletAddress === ADMIN_WALLET_ADDRESS;
};

/**
 * Check if the current user is an admin based on their public key
 * @param publicKey - The public key from useWallet hook
 * @returns true if the current user is an admin
 */
export const isCurrentUserAdmin = (publicKey: any): boolean => {
  if (!publicKey) return false;
  return isAdminWallet(publicKey.toBase58());
};

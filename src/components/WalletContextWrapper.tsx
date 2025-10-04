import { useMemo, useEffect } from "react";
import { ConnectionProvider, WalletProvider, useWallet } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

// Wallet change listener component
function WalletChangeListener() {
  const { publicKey } = useWallet()

  useEffect(() => {
    const currentWallet = publicKey?.toBase58()
    const previousWallet = sessionStorage.getItem("previousWallet")

    if (currentWallet && previousWallet && previousWallet !== currentWallet) {
      sessionStorage.setItem("previousWallet", currentWallet)
      window.location.reload()
    } else if (currentWallet) {
      sessionStorage.setItem("previousWallet", currentWallet)
    }
  }, [publicKey])

  return null
}

export default function WalletContextWrapper({ children }: { children: React.ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(
    () => 'https://winter-silent-lake.solana-mainnet.quiknode.pro/3e452fad7a2a3061d83b097d144b06b2e5230b2f/',
    []
  );
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network }), new TorusWalletAdapter()],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletChangeListener />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

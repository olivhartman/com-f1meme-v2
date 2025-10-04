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
    () => 'https://late-serene-feather.solana-mainnet.quiknode.pro/3efa333c9866046a5a40f12c3d04a3e918e13421/',
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

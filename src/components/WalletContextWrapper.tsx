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
    () => 'https://warmhearted-dawn-market.solana-mainnet.quiknode.pro/7e4374434d7bb18c04e5c23db44a545468e4e50f/',
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

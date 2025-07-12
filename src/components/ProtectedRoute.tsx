import { useWallet } from "@solana/wallet-adapter-react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { publicKey } = useWallet();

  // Debug logging
  console.log('ProtectedRoute - Wallet connected:', !!publicKey)
  console.log('ProtectedRoute - Public key:', publicKey?.toBase58())

  if (!publicKey) {
    console.log('ProtectedRoute - Redirecting to home page')
    return <Navigate to="/" replace />;
  }

  console.log('ProtectedRoute - Allowing access to protected route')
  return <>{children}</>;
};

export default ProtectedRoute; 
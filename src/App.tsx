import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppPage from './components/AppPage'
import ProfilePage from './components/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import Navigation from './components/Navigation'
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;
import WalletContextWrapper from './components/WalletContextWrapper';
import Community from './pages/community'
import SchedulePage from './pages/schedule'

function App() {
  return (
    <WalletContextWrapper>
      <Router>
        <Navigation activeSection="hero" />
        <Routes>
          <Route path="/" element={<AppPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/community" element={<Community />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </Router>
    </WalletContextWrapper>
  );
}

export default App

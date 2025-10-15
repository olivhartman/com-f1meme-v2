import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppPage from './components/AppPage'
import ProfilePage from './components/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import Navigation from './components/Navigation'
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;
import WalletContextWrapper from './components/WalletContextWrapper';
import { TranslationProvider } from './i18n/TranslationContext';
import Community from './pages/community'
import SchedulePage from './pages/schedule'
import Gallery from './pages/gallery'
import { AdminPanel } from './components/AdminPanel'

function App() {
  return (
    <TranslationProvider>
      <WalletContextWrapper>
        <Router>
          <Navigation />
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
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </Router>
      </WalletContextWrapper>
    </TranslationProvider>
  );
}

export default App

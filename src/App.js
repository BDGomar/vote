import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import VoteStatisticsPage from './pages/VoteStatisticsPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import PdfViewerPage from './pages/PdfViewerPage';
import SplashScreen from './components/SplashScreen';
import './App.css';

function App() {
  return (
    <>
      <SplashScreen />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/candidats"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidats/:id"
          element={
            <ProtectedRoute>
              <CandidateDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/candidats/:id/programme"
          element={
            <ProtectedRoute>
              <PdfViewerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistiques"
          element={
            <ProtectedRoute>
              <VoteStatisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profil"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

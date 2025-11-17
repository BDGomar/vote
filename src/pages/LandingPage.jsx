import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-overlay">
        <div className="landing-content">
          <div className="landing-icon">🎓</div>
          <h1>Bienvenue sur UA Vote</h1>
          <p>Votre plateforme de vote en ligne</p>
          <div className="landing-actions">
            <button onClick={() => navigate('/login')}>Se connecter</button>
            <button className="outlined" onClick={() => navigate('/register')}>
              Créer un compte
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;


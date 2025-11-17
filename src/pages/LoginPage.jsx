import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, authError, isSubmitting } = useAuth();
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!matricule || !password) {
      setLocalError('Veuillez renseigner votre matricule et votre mot de passe.');
      return;
    }
    setLocalError(null);
    const result = await login(matricule.trim(), password);
    if (result.success) {
      navigate('/candidats', { replace: true });
    }
  };

  return (
    <div className="auth-screen login-screen">
      <div className="auth-card">
        <h1>Bienvenue sur UA Vote</h1>
        <div className="auth-icon">🔐</div>
        <form onSubmit={handleSubmit}>
          <h2>Connexion</h2>
          <label>
            Matricule
            <input
              type="text"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="Saisissez votre matricule"
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
            />
          </label>
          {(localError || authError) && (
            <p className="form-error">{localError ?? authError}</p>
          )}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="auth-switch">
          Pas encore de compte ? <Link to="/register">Inscrivez-vous</Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;


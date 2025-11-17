import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, authError, isSubmitting } = useAuth();
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!matricule || !password || !confirmPassword) {
      setLocalError('Tous les champs sont obligatoires.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLocalError(null);
    setSuccessMessage(null);

    const result = await register(matricule.trim(), password, confirmPassword);
    if (result.success) {
      setSuccessMessage(result.message ?? 'Inscription réussie.');
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return (
    <div className="auth-screen register-screen">
      <div className="auth-card">
        <h1>Créer un compte</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Matricule
            <input
              type="text"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              placeholder="Ex : UA12345"
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choisissez un mot de passe"
            />
          </label>
          <label>
            Confirmer le mot de passe
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répétez le mot de passe"
            />
          </label>
          {(localError || authError) && (
            <p className="form-error">{localError ?? authError}</p>
          )}
          {successMessage && (
            <p className="form-success">{successMessage}</p>
          )}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Inscription...' : 'S’inscrire'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;


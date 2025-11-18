import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import Footer from '../components/Footer';
import { fetchCandidats } from '../services/candidatService';
import { submitVote } from '../services/voteService';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../config/apiConfig';

const FALLBACK_IMAGE = '/placeholder.png';

const HomePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [candidats, setCandidats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteMessage, setVoteMessage] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const loadCandidats = async () => {
      try {
        const data = await fetchCandidats();
        setCandidats(data);
      } catch (err) {
        setError('Impossible de charger les candidats.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCandidats();
  }, []);

  const handleNullVote = async () => {
    const confirmation = window.confirm(
      'Confirmez-vous l’enregistrement d’un bulletin nul ?',
    );
    if (!confirmation) return;

    setIsVoting(true);
    const result = await submitVote(null, token, { isNullVote: true });
    setIsVoting(false);
    setVoteMessage(result.message);
  };

  return (
    <div className="page">
      <main className="content with-tab-padding">
        <header className="page-header">
          <h1>Candidats</h1>
          <p>Consultez la liste des candidats et leurs programmes.</p>
        </header>
        {isLoading && <p className="info">Chargement des candidats...</p>}
        {error && <p className="error">{error}</p>}
        {voteMessage && <p className="info">{voteMessage}</p>}
        {!isLoading && !error && (
          <div className="candidat-grid">
            {candidats.map((candidat) => (
              <article
                key={candidat.id}
                className="candidat-card"
                onClick={() => navigate(`/candidats/${candidat.id}`)}
              >
                <img
                  src={getImageUrl(candidat.photo) || FALLBACK_IMAGE}
                  alt={`${candidat.nom} ${candidat.prenom}`}
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                />
                <div className="candidat-info">
                  <h2>
                    {candidat.nom} {candidat.prenom}
                  </h2>
                  <p className="filiere">
                    {candidat.filiere}
                    {candidat.niveau}
                  </p>
                </div>
              </article>
            ))}
            <article className="candidat-card null-card">
              <div className="null-icon">⚖️</div>
              <div className="candidat-info">
                <h2>Bulletin nul</h2>
                <p className="filiere">Enregistrer un bulletin blanc / nul</p>
                <button
                  className="null-vote-btn"
                  onClick={handleNullVote}
                  disabled={isVoting}
                >
                  {isVoting ? 'Envoi en cours...' : 'Déposer un bulletin nul'}
                </button>
              </div>
            </article>
          </div>
        )}
      </main>
      <Footer />
      <MainNavigation />
    </div>
  );
};

export default HomePage;


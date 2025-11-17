import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import Footer from '../components/Footer';
import { fetchCandidatById } from '../services/candidatService';
import { getImageUrl, getPdfUrl } from '../config/apiConfig';
import { submitVote } from '../services/voteService';
import { useAuth } from '../context/AuthContext';

const FALLBACK_IMAGE = '/placeholder.png';

const CandidateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [candidat, setCandidat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [voteMessage, setVoteMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    const loadCandidat = async () => {
      try {
        const data = await fetchCandidatById(id);
        setCandidat(data);
      } catch (err) {
        setError('Impossible de charger ce candidat.');
      } finally {
        setIsLoading(false);
      }
    };
    loadCandidat();
  }, [id]);

  const handleVote = async () => {
    const shouldVote = window.confirm(
      'Êtes-vous sûr de vouloir voter pour ce candidat ?',
    );
    if (!shouldVote) return;

    setIsVoting(true);
    const result = await submitVote(Number(id), token);
    setIsVoting(false);
    setVoteMessage(result.message);
  };

  if (isLoading) {
    return (
      <div className="page">
        <main className="content with-tab-padding">
          <p className="info">Chargement du profil...</p>
        </main>
        <Footer />
        <MainNavigation />
      </div>
    );
  }

  if (error || !candidat) {
    return (
      <div className="page">
        <main className="content with-tab-padding">
          <p className="error">{error ?? 'Candidat introuvable.'}</p>
        </main>
        <Footer />
        <MainNavigation />
      </div>
    );
  }

  return (
    <div className="page">
      <main className="content detail-page with-tab-padding">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Retour
        </button>
        <div className="detail-card">
          <img
            src={getImageUrl(candidat.photo) || FALLBACK_IMAGE}
            alt={`${candidat.nom} ${candidat.prenom}`}
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <div className="detail-info">
            <h1>
              {candidat.nom} {candidat.prenom}
            </h1>
            <p>
              <strong>Filière :</strong> {candidat.filiere}
            </p>
            <p>
              <strong>Niveau :</strong> {candidat.niveau}
            </p>
            <div className="detail-actions">
              <button
                onClick={() =>
                  navigate(`/candidats/${id}/programme`, {
                    state: { url: getPdfUrl(candidat.programme) },
                  })
                }
              >
                Voir le programme
              </button>
              <button onClick={handleVote} disabled={isVoting}>
                {isVoting ? 'Vote en cours...' : 'Voter'}
              </button>
            </div>
            {voteMessage && <p className="info">{voteMessage}</p>}
          </div>
        </div>
      </main>
      <Footer />
      <MainNavigation />
    </div>
  );
};

export default CandidateDetailPage;


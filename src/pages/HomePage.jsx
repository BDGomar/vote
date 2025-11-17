import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import Footer from '../components/Footer';
import { fetchCandidats } from '../services/candidatService';
import { getImageUrl } from '../config/apiConfig';

const FALLBACK_IMAGE = '/placeholder.png';

const HomePage = () => {
  const navigate = useNavigate();
  const [candidats, setCandidats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="page">
      <main className="content with-tab-padding">
        <header className="page-header">
          <h1>Candidats</h1>
          <p>Consultez la liste des candidats et leurs programmes.</p>
        </header>
        {isLoading && <p className="info">Chargement des candidats...</p>}
        {error && <p className="error">{error}</p>}
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
          </div>
        )}
      </main>
      <Footer />
      <MainNavigation />
    </div>
  );
};

export default HomePage;


import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MainNavigation from '../components/MainNavigation';
import { getPdfUrl } from '../config/apiConfig';
import { fetchCandidatById } from '../services/candidatService';
import { useEffect, useState } from 'react';

const PdfViewerPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [pdfUrl, setPdfUrl] = useState(location.state?.url ?? null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProgramme = async () => {
      if (pdfUrl || !id) return;
      try {
        const candidat = await fetchCandidatById(id);
        if (candidat?.programme) {
          setPdfUrl(getPdfUrl(candidat.programme));
        } else {
          setError('Programme introuvable.');
        }
      } catch (err) {
        setError('Impossible de récupérer le programme.');
      }
    };
    loadProgramme();
  }, [id, pdfUrl]);

  return (
    <div className="page">
      <main className="content with-tab-padding">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Retour
        </button>
        {!pdfUrl && !error && <p className="info">Chargement du programme...</p>}
        {error && <p className="error">{error}</p>}
        {pdfUrl && (
          <div className="pdf-viewer">
            <iframe title="Programme du candidat" src={pdfUrl} />
          </div>
        )}
      </main>
      <MainNavigation />
    </div>
  );
};

export default PdfViewerPage;


import MainNavigation from '../components/MainNavigation';
import Footer from '../components/Footer';

const VoteStatisticsPage = () => (
  <div className="page">
    <main className="content with-tab-padding">
      <header className="page-header">
        <h1>Statistiques indisponibles</h1>
        <p>Cette section est momentanément désactivée.</p>
      </header>
      <div className="info blocked-info">
        <p className="mb-1">🛑 Accès temporairement bloqué</p>
        <p className="mb-0">
          Les statistiques seront de nouveau accessibles très bientôt.
          Merci de votre compréhension.
        </p>
      </div>
    </main>
    <Footer />
    <MainNavigation />
  </div>
);

export default VoteStatisticsPage;


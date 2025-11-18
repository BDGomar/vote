import { useEffect, useState } from 'react';
import MainNavigation from '../components/MainNavigation';
import Footer from '../components/Footer';
import { fetchVoteStats } from '../services/voteService';

const VoteStatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchVoteStats();
        setStats(data);
      } catch (err) {
        setError('Impossible de récupérer les statistiques.');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="page">
      <main className="content with-tab-padding">
        <header className="page-header">
          <h1>Statistiques de votes</h1>
          <p>Suivez l’avancement général du scrutin.</p>
        </header>
        {isLoading && <p className="info">Chargement des statistiques...</p>}
        {error && <p className="error">{error}</p>}
        {!isLoading && !error && stats && (
          <>
            <div className="stats-overview">
              <article className="overview-card">
                <span>Total des bulletins</span>
                <strong>{stats.total_votes ?? 0}</strong>
              </article>
              <article className="overview-card null">
                <span>Bulletins nuls</span>
                <strong>{stats.null_votes ?? 0}</strong>
                <small>
                  {stats.total_votes
                    ? `${(
                        ((stats.null_votes ?? 0) / stats.total_votes) *
                        100
                      ).toFixed(1)}%`
                    : '0%'}
                </small>
              </article>
            </div>

            <div className="stats-list">
              {stats.candidates?.map((candidate, index) => {
                const key =
                  candidate.candidat_id ??
                  candidate.id ??
                  `${candidate.nom}-${candidate.prenom}-${index}`;

                const validVotes =
                  (stats.total_votes ?? 0) - (stats.null_votes ?? 0);
                const percentage =
                  validVotes > 0
                    ? (candidate.total_votes / validVotes) * 100
                    : 0;

                return (
                  <article key={key} className="stat-card">
                    <h2>
                      {candidate.nom} {candidate.prenom}
                    </h2>
                    <p>Votes : {candidate.total_votes ?? 0}</p>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="percentage">
                      {percentage.toFixed(1)}%
                    </span>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </main>
      <Footer />
      <MainNavigation />
    </div>
  );
};

export default VoteStatisticsPage;


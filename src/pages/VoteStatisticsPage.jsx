import { useEffect, useMemo, useState } from 'react';
import MainNavigation from '../components/MainNavigation';
import Footer from '../components/Footer';
import { fetchVoteStats } from '../services/voteService';
import { useAuth } from '../context/AuthContext';

const DEFAULT_STATS = {
  total_votes: 0,
  null_votes: 0,
  candidates: [],
  registered_voters: null,
  participation_rate: null,
  null_vote_rate: null,
  last_updated: null,
};

const normalizeNumber = (value) => {
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const computePercentage = (part, total) => {
  if (!total) return 0;
  return Number(((part / total) * 100).toFixed(1));
};

const formatPercentageLabel = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return `${value.toFixed(value >= 100 ? 0 : 1)}%`;
};

const VoteStatisticsPage = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      if (!token) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchVoteStats(token);
        if (!isMounted) return;

        const totalVotes = normalizeNumber(data?.total_votes);
        const nullVotes = normalizeNumber(data?.null_votes);

        setStats({
          total_votes: totalVotes,
          null_votes: nullVotes,
          candidates: data?.candidates ?? [],
          registered_voters:
            normalizeNumber(data?.registered_voters ?? data?.total_registered) || null,
          participation_rate:
            data?.participation_rate ?? data?.participation ?? null,
          null_vote_rate:
            data?.null_vote_rate ??
            (totalVotes ? computePercentage(nullVotes, totalVotes) : null),
          last_updated: data?.last_updated ?? data?.updated_at ?? null,
        });
      } catch (err) {
        if (!isMounted) return;
        setError('Impossible de charger les statistiques. Veuillez réessayer.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const {
    total_votes: totalVotes,
    null_votes: nullVotes,
    registered_voters: registeredVoters,
    participation_rate: participationRateFromApi,
    null_vote_rate: nullVoteRateFromApi,
    last_updated: lastUpdated,
  } = stats;

  const candidates = useMemo(
    () =>
      [...(stats.candidates ?? [])]
        .map((candidate) => ({
          ...candidate,
          votes_count: normalizeNumber(candidate.votes_count ?? candidate.votes),
        }))
        .sort((a, b) => b.votes_count - a.votes_count),
    [stats.candidates],
  );

  const participationRate = useMemo(() => {
    if (participationRateFromApi !== null && participationRateFromApi !== undefined) {
      return normalizeNumber(participationRateFromApi);
    }
    if (registeredVoters) {
      return computePercentage(totalVotes, registeredVoters);
    }
    return null;
  }, [participationRateFromApi, registeredVoters, totalVotes]);

  const nullVoteRate = useMemo(() => {
    if (nullVoteRateFromApi !== null && nullVoteRateFromApi !== undefined) {
      return normalizeNumber(nullVoteRateFromApi);
    }
    return totalVotes ? computePercentage(nullVotes, totalVotes) : null;
  }, [nullVoteRateFromApi, totalVotes, nullVotes]);

  const hasResults = candidates.length > 0 && totalVotes > 0;

  return (
    <div className="page">
      <main className="content with-tab-padding">
        <header className="page-header">
          <h1>Statistiques des votes</h1>
          <p>Suivez en temps réel la répartition des bulletins.</p>
          {lastUpdated && (
            <small className="stat-meta">
              Dernière mise à jour&nbsp;: {new Date(lastUpdated).toLocaleString('fr-FR')}
            </small>
          )}
        </header>

        {isLoading && (
          <p className="info">Chargement des statistiques en cours...</p>
        )}
        {error && <p className="error">{error}</p>}

        {!isLoading && !error && (
          <>
            <section className="stats-overview">
              <article className="overview-card">
                <span>Total des bulletins</span>
                <strong>{totalVotes}</strong>
                {registeredVoters && (
                  <small>
                    {formatPercentageLabel(participationRate)} de participation
                  </small>
                )}
              </article>
              <article className="overview-card">
                <span>Électeurs inscrits</span>
                <strong>{registeredVoters ?? '—'}</strong>
                <small>Données communiquées par la CÉI</small>
              </article>
              <article className="overview-card null">
                <span>Bulletins nuls</span>
                <strong>{nullVotes}</strong>
                <small>{formatPercentageLabel(nullVoteRate)} des bulletins</small>
              </article>
            </section>

            {hasResults ? (
              <section className="stats-list">
                {candidates.map((candidate, index) => {
                  const percentage = computePercentage(
                    candidate.votes_count,
                    totalVotes,
                  );
                  return (
                    <article className="stat-card" key={candidate.id ?? index}>
                      <header>
                        <div>
                          <p className="stat-title">
                            {candidate.nom} {candidate.prenom}
                          </p>
                          {(candidate.filiere || candidate.niveau) && (
                            <p className="stat-subtitle">
                              {candidate.filiere}
                              {candidate.niveau ? ` • ${candidate.niveau}` : ''}
                            </p>
                          )}
                        </div>
                        <div className="percentage">{formatPercentageLabel(percentage)}</div>
                      </header>
                      <p className="stat-votes">
                        {candidate.votes_count} vote{candidate.votes_count > 1 ? 's' : ''}
                      </p>
                      <div className="progress-bar" aria-hidden="true">
                        <div
                          className="progress"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="stat-meta">
                        Position #{index + 1} sur {candidates.length}
                      </p>
                    </article>
                  );
                })}
              </section>
            ) : (
              <div className="info">
                Aucun vote n’a été enregistré pour le moment. Revenez un peu plus tard.
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
      <MainNavigation />
    </div>
  );
};

export default VoteStatisticsPage;


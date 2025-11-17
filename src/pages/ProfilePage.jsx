import MainNavigation from '../components/MainNavigation';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { token, user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="page">
      <main className="content with-tab-padding">
        <header className="page-header">
          <h1>Profil</h1>
          <p>Gérez vos informations de connexion et votre session.</p>
        </header>
        <section className="profile-card">
          {user ? (
            <>
              <div className="profile-row">
                <span>Matricule</span>
                <strong>{user.matricule}</strong>
              </div>
              {user.etudiant ? (
                <>
                  <div className="profile-row">
                    <span>Nom</span>
                    <strong>{user.etudiant.nom}</strong>
                  </div>
                  <div className="profile-row">
                    <span>Prénom</span>
                    <strong>{user.etudiant.prenom}</strong>
                  </div>
                  <div className="profile-row">
                    <span>Filière</span>
                    <strong>{user.etudiant.filiere}</strong>
                  </div>
                  <div className="profile-row">
                    <span>Niveau</span>
                    <strong>{user.etudiant.niveau}</strong>
                  </div>
                </>
              ) : (
                <p className="info">Aucune information d’étudiant trouvée.</p>
              )}
            </>
          ) : (
            <p className="info">Chargement des informations…</p>
          )}
          <div className="profile-row">
            <span>État de session</span>
            <strong>{token ? 'Connecté' : 'Déconnecté'}</strong>
          </div>
          <button className="logout-btn solid" onClick={handleLogout}>
            Déconnexion
          </button>
        </section>
      </main>
      <Footer />
      <MainNavigation />
    </div>
  );
};

export default ProfilePage;


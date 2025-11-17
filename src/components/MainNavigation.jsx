import { NavLink, useNavigate } from 'react-router-dom';
import { FaUsers, FaChartPie, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { to: '/candidats', label: 'Candidats', Icon: FaUsers },
  { to: '/statistiques', label: 'Statistique', Icon: FaChartPie },
  { to: '/profil', label: 'Profil', Icon: FaUserCircle },
];

const MainNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="bottom-tab">
      <div className="tab-links">
        {tabs.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `tab-link${isActive ? ' active' : ''}`
            }
          >
            <Icon className="tab-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MainNavigation;


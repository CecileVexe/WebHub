import { Link, useLocation } from 'react-router-dom';
import { modulesList } from '../router/routes';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1>📦 Modules</h1>
      </div>

      <ul className="nav-list">
        {modulesList.map((module) => (
          <li key={module.path}>
            <Link
              to={module.path}
              className={`nav-link ${
                location.pathname === module.path ? 'active' : ''
              }`}
            >
              {module.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;

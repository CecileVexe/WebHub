import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2>Page non trouvée</h2>
        <p>Désolé, la page que vous recherchez n'existe pas.</p>
        <div className="not-found-actions">
          <button onClick={() => navigate('/')} className="primary-button">
            Retour à l'accueil
          </button>
          <button onClick={() => navigate(-1)} className="secondary-button">
            Page précédente
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

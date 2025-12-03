import { useNavigate } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="not-found" role="main">
      <div className="not-found-content">
        <p className="error-code" aria-label="Erreur 404">404</p>
        <h1>Page non trouvée</h1>
        <p>Désolé, la page que vous recherchez n'existe pas.</p>
        <nav className="not-found-actions" aria-label="Actions de navigation">
          <button 
            type="button"
            onClick={() => navigate('/')} 
            className="primary-button"
            aria-label="Retourner à la page d'accueil"
          >
            Retour à l'accueil
          </button>
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="secondary-button"
            aria-label="Revenir à la page précédente"
          >
            Page précédente
          </button>
        </nav>
      </div>
    </main>
  );
};

export default NotFound;

import { BrowserRouter } from 'react-router-dom';
import Navigation from './components/Navigation.tsx';
import { AppRouter } from './router';

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Navigation />
        <main style={{ flex: 1 }}>
          <AppRouter />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

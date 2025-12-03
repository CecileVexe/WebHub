import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <main className="app-content">
        <AppRouter />
      </main>
    </BrowserRouter>
  );
}

export default App;

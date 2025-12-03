import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './contexts/ProjectContext';
import Home from './views/Home';
import ProjectView from './views/ProjectView';
import NotFound from './views/NotFound';
import './App.css'

function App() {
  return (
    <ProjectProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ProjectProvider>
  )
}

export default App;
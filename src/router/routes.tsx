import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

// Import lazy des modules
const AnimFlowModule = lazy(() => import('../components/animFlow/main.tsx'));
const BleuPrintModule = lazy(() => import('../components/bleuPrint/main.tsx'));
const CodeForgeModule = lazy(() => import('../components/codeForge/main.tsx'));

// Fallback loading component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px'
  }}>
    ⏳ Chargement du module...
  </div>
);

// Wrapper pour Suspense
const ModuleWrapper = ({ Component }: { Component: React.ComponentType }) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const routes = [
  {
    path: '/',
    element: <Navigate to="/animflow" replace />,
  },
  {
    path: '/animflow',
    element: <ModuleWrapper Component={AnimFlowModule} />,
    name: 'AnimFlow'
  },
  {
    path: '/blueprint',
    element: <ModuleWrapper Component={BleuPrintModule} />,
    name: 'BleuPrint'
  },
  {
    path: '/codeforge',
    element: <ModuleWrapper Component={CodeForgeModule} />,
    name: 'CodeForge'
  },
  {
    path: '*',
    element: <Navigate to="/animflow" replace />,
  }
];

// Export la liste pour navigation
export const modulesList = routes.filter(r => r.name);

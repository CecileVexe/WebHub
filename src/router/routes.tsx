import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const AnimFlowModule = lazy(() => import('../components/animFlow/main.tsx'));
const BleuPrintModule = lazy(() => import('../components/bleuPrint/main.tsx'));
const CodeForgeModule = lazy(() => import('../components/codeForge/main.tsx'));

export const routes = [
  {
    path: '/',
    element: <Navigate to="/animflow" replace />,
  },
  {
    path: '/animflow',
    element: <><AnimFlowModule /></>,
    name: 'AnimFlow'
  },
  {
    path: '/blueprint',
    element: <><BleuPrintModule /></>,
    name: 'BleuPrint'
  },
  {
    path: '/codeforge',
    element: <><CodeForgeModule /></>,
    name: 'CodeForge'
  },
  {
    path: '*',
    element: <Navigate to="/animflow" replace />,
  }
];


export const modulesList = routes.filter(r => r.name);

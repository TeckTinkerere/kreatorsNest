import { Navigate } from 'react-router-dom';
import { useBrowseMode } from '../context/BrowseModeContext';

const REDIRECTS = {
  '/templates': '/documents',
  '/downloads': '/documents',
  '/learning': (mode) => (mode === 'guided' ? '/essentials' : '/resources?tab=learning'),
  '/tools': (mode) => (mode === 'guided' ? '/essentials' : '/resources?tab=tools'),
  '/gigs': (mode) => (mode === 'guided' ? '/more' : '/resources?tab=gigs'),
  '/communities': (mode) => (mode === 'guided' ? '/more' : '/community'),
};

const resolveRedirect = (from, mode) => {
  const target = REDIRECTS[from] ?? '/';
  return typeof target === 'function' ? target(mode) : target;
};

export default function LegacyRedirect({ from }) {
  const { effectiveMode } = useBrowseMode();
  const to = resolveRedirect(from, effectiveMode);

  return <Navigate to={to} replace />;
}

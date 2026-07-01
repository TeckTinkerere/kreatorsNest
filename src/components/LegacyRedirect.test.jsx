import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import LegacyRedirect from './LegacyRedirect';
import { BrowseModeProvider } from '../context/BrowseModeContext';

function ResourcesPage() {
  const location = useLocation();
  return <div>{`Resources Page${location.search}`}</div>;
}

const setStoredMode = (mode) => {
  localStorage.setItem('kn-browse-mode', JSON.stringify({
    v: 1,
    mode,
    forkDismissed: false,
    updatedAt: '2026-07-01T00:00:00.000Z',
  }));
};

const renderRedirect = ({ fromPath, routeFrom, mode }) => {
  if (mode) setStoredMode(mode);

  return render(
    <BrowseModeProvider>
      <MemoryRouter initialEntries={[fromPath]}>
        <Routes>
          <Route path={routeFrom} element={<LegacyRedirect from={routeFrom} />} />
          <Route path="/documents" element={<div>Documents Page</div>} />
          <Route path="/essentials" element={<div>Essentials Page</div>} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/more" element={<div>More Page</div>} />
          <Route path="/community" element={<div>Community Page</div>} />
        </Routes>
      </MemoryRouter>
    </BrowseModeProvider>
  );
};

beforeEach(() => {
  localStorage.clear();
});

test.each([
  ['/templates', '/templates'],
  ['/downloads', '/downloads'],
])('redirects %s to /documents', (fromPath, routeFrom) => {
  renderRedirect({ fromPath, routeFrom });
  expect(screen.getByText('Documents Page')).toBeInTheDocument();
});

test.each([
  ['/learning', '/learning', 'Essentials Page'],
  ['/tools', '/tools', 'Essentials Page'],
  ['/gigs', '/gigs', 'More Page'],
  ['/communities', '/communities', 'More Page'],
])('redirects %s in guided mode', (fromPath, routeFrom, destinationText) => {
  renderRedirect({ fromPath, routeFrom, mode: 'guided' });
  expect(screen.getByText(destinationText)).toBeInTheDocument();
});

test.each([
  ['/learning', '/learning', 'Resources Page?tab=learning'],
  ['/tools', '/tools', 'Resources Page?tab=tools'],
  ['/gigs', '/gigs', 'Resources Page?tab=gigs'],
  ['/communities', '/communities', 'Community Page'],
])('redirects %s in explore mode', (fromPath, routeFrom, destinationText) => {
  renderRedirect({ fromPath, routeFrom, mode: 'explore' });
  expect(screen.getByText(destinationText)).toBeInTheDocument();
});

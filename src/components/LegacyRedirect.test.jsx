import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LegacyRedirect from './LegacyRedirect';
import { BrowseModeProvider } from '../context/BrowseModeContext';

const renderRedirect = (fromPath, routeFrom) => render(
  <BrowseModeProvider>
    <MemoryRouter initialEntries={[fromPath]}>
      <Routes>
        <Route path={routeFrom} element={<LegacyRedirect from={routeFrom} />} />
        <Route path="/documents" element={<div>Documents Page</div>} />
        <Route path="/essentials" element={<div>Essentials Page</div>} />
      </Routes>
    </MemoryRouter>
  </BrowseModeProvider>
);

beforeEach(() => {
  localStorage.clear();
});

test('redirects /templates to /documents', () => {
  renderRedirect('/templates', '/templates');
  expect(screen.getByText('Documents Page')).toBeInTheDocument();
});

test('redirects /learning to /essentials in guided mode', () => {
  localStorage.setItem('kn-browse-mode', JSON.stringify({
    v: 1,
    mode: 'guided',
    forkDismissed: false,
    updatedAt: '2026-07-01T00:00:00.000Z',
  }));

  renderRedirect('/learning', '/learning');
  expect(screen.getByText('Essentials Page')).toBeInTheDocument();
});

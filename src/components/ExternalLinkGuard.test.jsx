import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import ExternalLinkGuard from './ExternalLinkGuard';

/** Probe component that surfaces the current location for assertions. */
function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
}

/**
 * @param {object} [options]
 * @param {boolean} [options.online=true]
 */
function renderWithGuard({ online = true } = {}) {
  Object.defineProperty(navigator, 'onLine', {
    configurable: true,
    get: () => online,
  });

  return render(
    <MemoryRouter initialEntries={['/']}>
      <ExternalLinkGuard />
      <LocationProbe />
      <Routes>
        <Route
          path="/"
          element={
            <a href="https://example.com/tool" target="_blank" rel="noopener noreferrer">
              External tool
            </a>
          }
        />
        <Route path="/connection-required" element={<div>Connection page</div>} />
        <Route path="/resources" element={<a href="/starter-kit">Internal</a>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('ExternalLinkGuard', () => {
  const originalOnline = navigator.onLine;

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => originalOnline,
    });
  });

  it('allows external links when online', () => {
    renderWithGuard({ online: true });
    const link = screen.getByRole('link', { name: /external tool/i });
    fireEvent.click(link);
    expect(screen.getByTestId('location')).toHaveTextContent('/');
  });

  it('redirects external links to connection-required when offline', async () => {
    renderWithGuard({ online: false });
    fireEvent.click(screen.getByRole('link', { name: /external tool/i }));

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent).toContain('/connection-required');
      expect(screen.getByTestId('location').textContent).toContain('example.com');
    });
    expect(screen.getByText('Connection page')).toBeInTheDocument();
  });

  it('does not gate same-origin links when offline', async () => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => false,
    });

    render(
      <MemoryRouter initialEntries={['/resources']}>
        <ExternalLinkGuard />
        <LocationProbe />
        <Routes>
          <Route path="/resources" element={<a href="/starter-kit">Internal</a>} />
          <Route path="/starter-kit" element={<div>Starter</div>} />
          <Route path="/connection-required" element={<div>Connection page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('link', { name: /internal/i }));
    await waitFor(() => {
      expect(screen.queryByText('Connection page')).not.toBeInTheDocument();
    });
  });
});

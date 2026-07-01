import { render, screen, fireEvent } from '@testing-library/react';
import ResourceCard from './ResourceCard';

// Global stubs (IntersectionObserver, matchMedia, scrollTo) are in setupTests.js.

/** Minimal valid resource fixture matching the shape expected by ResourceCard. */
const makeResource = (overrides = {}) => ({
  id: 'test-1',
  title: 'Test Resource',
  description: 'A test description.',
  type: 'Tools',
  category: 'UX/UI & Web Design',
  link: 'https://example.com',
  icon: 'Figma',      // not in ICON_MAP → falls back to emoji/text render
  tags: ['Tag A', 'Tag B', 'Tag C'],
  ...overrides,
});

describe('ResourceCard', () => {
  // ─── Basic rendering ──────────────────────────────────────────────────────

  it('renders the resource title', () => {
    render(<ResourceCard resource={makeResource()} />);
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
  });

  it('renders the resource description', () => {
    render(<ResourceCard resource={makeResource()} />);
    expect(screen.getByText('A test description.')).toBeInTheDocument();
  });

  it('renders the resource type badge', () => {
    render(<ResourceCard resource={makeResource()} />);
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });

  it('renders the category label', () => {
    render(<ResourceCard resource={makeResource()} />);
    expect(screen.getByText('UX/UI & Web Design')).toBeInTheDocument();
  });

  it('renders the Explore link with the correct href', () => {
    render(<ResourceCard resource={makeResource()} />);
    const link = screen.getByRole('link', { name: /explore/i });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  // ─── Tag rendering ────────────────────────────────────────────────────────

  it('renders at most 2 tags', () => {
    // Resource has 3 tags; only the first 2 should appear
    render(<ResourceCard resource={makeResource({ tags: ['Alpha', 'Beta', 'Gamma'] })} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.queryByText('Gamma')).not.toBeInTheDocument();
  });

  it('renders without crashing when tags array is empty', () => {
    expect(() => render(<ResourceCard resource={makeResource({ tags: [] })} />)).not.toThrow();
  });

  // ─── Icon rendering ───────────────────────────────────────────────────────

  it('renders a known icon name from ICON_MAP as an svg element', () => {
    const { container } = render(<ResourceCard resource={makeResource({ icon: 'Camera' })} />);
    // Lucide renders icons as <svg>
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders an unknown icon name as a text/emoji fallback', () => {
    render(<ResourceCard resource={makeResource({ icon: '🎨' })} />);
    expect(screen.getByText('🎨')).toBeInTheDocument();
  });

  // ─── Editorial variant ────────────────────────────────────────────────────

  it('applies editorial styling for Learning type', () => {
    const { container } = render(<ResourceCard resource={makeResource({ type: 'Learning' })} />);
    // The editorial class has a distinctive rounded corner pattern
    expect(container.firstChild).toHaveClass('rounded-tl-3xl');
  });

  it('applies editorial styling for Scenarios type', () => {
    const { container } = render(<ResourceCard resource={makeResource({ type: 'Scenarios' })} />);
    expect(container.firstChild).toHaveClass('rounded-tl-3xl');
  });

  it('applies standard (non-editorial) styling for Tools type', () => {
    const { container } = render(<ResourceCard resource={makeResource({ type: 'Tools' })} />);
    expect(container.firstChild).toHaveClass('rounded-2xl');
    expect(container.firstChild).not.toHaveClass('rounded-tl-3xl');
  });

  // ─── Interaction callback ─────────────────────────────────────────────────

  it('calls onInteract with the resource category when Explore is clicked', () => {
    const onInteract = jest.fn();
    render(<ResourceCard resource={makeResource()} onInteract={onInteract} />);
    fireEvent.click(screen.getByRole('link', { name: /explore/i }));
    expect(onInteract).toHaveBeenCalledTimes(1);
    expect(onInteract).toHaveBeenCalledWith('UX/UI & Web Design');
  });

  it('does not throw when onInteract is not provided', () => {
    render(<ResourceCard resource={makeResource()} />);
    expect(() => fireEvent.click(screen.getByRole('link', { name: /explore/i }))).not.toThrow();
  });

  // ─── Compact variant ────────────────────────────────────────────────────────

  it('compact variant hides type badge, category, and tags', () => {
    render(<ResourceCard resource={makeResource()} variant="compact" />);
    expect(screen.queryByText('Tools')).not.toBeInTheDocument();
    expect(screen.queryByText('UX/UI & Web Design')).not.toBeInTheDocument();
    expect(screen.queryByText('Tag A')).not.toBeInTheDocument();
  });

  it('compact variant still renders title and explore link', () => {
    render(<ResourceCard resource={makeResource()} variant="compact" />);
    expect(screen.getByText('Test Resource')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explore/i })).toBeInTheDocument();
  });
});

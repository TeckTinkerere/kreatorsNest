import { render, screen, fireEvent } from '@testing-library/react';
import { BrowseModeProvider } from '../context/BrowseModeContext';
import BrowseModeToggle from './BrowseModeToggle';

const renderToggle = (props = {}) =>
  render(
    <BrowseModeProvider>
      <BrowseModeToggle isDesktopOpen={true} {...props} />
    </BrowseModeProvider>
  );

test('renders Guided and Explore segments', () => {
  renderToggle();
  expect(screen.getByRole('button', { name: /guided/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /explore/i })).toBeInTheDocument();
});

test('clicking Guided sets aria-pressed', () => {
  renderToggle();
  fireEvent.click(screen.getByRole('button', { name: /guided/i }));
  expect(screen.getByRole('button', { name: /guided/i })).toHaveAttribute('aria-pressed', 'true');
});

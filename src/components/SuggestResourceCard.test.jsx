import { render, screen, fireEvent } from '@testing-library/react';
import SuggestResourceCard from './SuggestResourceCard';
import { isSuggestEnabled } from '../config/contribute';
import { trackEvent } from '../utils/analytics';

const FORM_URL = 'https://forms.gle/example';

// The config is read at module scope in the component's imports, so control it
// here rather than re-importing the component with different env vars.
jest.mock('../config/contribute', () => ({
  SUGGEST_FORM_URL: 'https://forms.gle/example',
  isSuggestEnabled: jest.fn(),
}));

jest.mock('../utils/analytics', () => ({
  EVENTS: { SUGGEST_OPEN: 'suggest-open' },
  trackEvent: jest.fn(),
}));

beforeEach(() => {
  isSuggestEnabled.mockReturnValue(true);
});

afterEach(() => {
  jest.clearAllMocks();
});

it('renders nothing when no form is configured, leaving no dead call to action', () => {
  isSuggestEnabled.mockReturnValue(false);

  const { container } = render(<SuggestResourceCard />);

  expect(container).toBeEmptyDOMElement();
});

it('links to the form and opens it safely in a new tab', () => {
  render(<SuggestResourceCard context="resources" />);

  const link = screen.getByRole('link', { name: /add a resource/i });
  expect(link).toHaveAttribute('href', FORM_URL);
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
});

it('renders a slim row in the inline variant', () => {
  render(<SuggestResourceCard variant="inline" />);

  expect(screen.getByRole('link', { name: /belongs here/i })).toHaveAttribute('href', FORM_URL);
});

it('records where the suggestion came from', () => {
  render(<SuggestResourceCard context="community" />);

  fireEvent.click(screen.getByRole('link', { name: /add a resource/i }));

  expect(trackEvent).toHaveBeenCalledWith('suggest-open', { context: 'community' });
});

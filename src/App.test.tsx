import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders headerk', () => {
  render(<App />);
  const linkElement = screen.getByText(/Metrics Generator/i);
  expect(linkElement).toBeInTheDocument();
});

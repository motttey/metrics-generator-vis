import { render, screen } from '@testing-library/react';
import App from './App';
import { vi, expect, test } from "vitest";

vi.mock('d3');

vi.mock('./ScatterPlot', () => ({
  default: () => <svg id="scatterPlot" />,
}));

vi.mock('./WeightVis', () => ({
  default: () => <svg id="weightVis" />,
}));

test('renders header', () => {
  render(<App />);
  const linkElementList = screen.getAllByText(/Metrics Generator/i);
  expect(linkElementList.length).toBeGreaterThan(0);
});

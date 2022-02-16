import React from 'react';
import { render, screen } from '@testing-library/react';
import GraphClient from './GraphClientApp';

test('renders learn react link', () => {
  render(<GraphClient />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

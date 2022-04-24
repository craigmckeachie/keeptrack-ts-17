import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

test('renders home heading', () => {
  render(<HomePage />);
  expect(screen.getByRole('heading')).toHaveTextContent('Home');
});

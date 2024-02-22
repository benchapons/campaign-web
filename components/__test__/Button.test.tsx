import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Button from '../common/Button';

describe('Home', () => {
  it('renders a heading', () => {
    render(
      <Button theme="primary" name="btn">
        btn
      </Button>
    );

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveTextContent(/btn/i);
  });
});

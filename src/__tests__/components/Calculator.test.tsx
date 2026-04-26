import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calculator } from '../../components/Calculator/Calculator';

describe('Calculator Component', () => {
    test('renders calculator display', () => {
        render(<Calculator />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('handles basic arithmetic', () => {
        render(<Calculator />);

        fireEvent.click(screen.getByText('2'));
        fireEvent.click(screen.getByText('+'));
        fireEvent.click(screen.getByText('3'));
        fireEvent.click(screen.getByText('='));

        expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    });
});

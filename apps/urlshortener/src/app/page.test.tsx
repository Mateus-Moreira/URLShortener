import '@testing-library/jest-dom';
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Index from './page';

// Mock js-cookie
jest.mock('js-cookie', () => ({ get: () => undefined, remove: () => {} }));

Object.assign(navigator, {
  clipboard: { writeText: jest.fn() },
});

describe('Index (Home)', () => {
  it('exibe o botão Copiar após gerar uma URL', async () => {
    // Mock fetch para simular resposta da API
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ shortUrl: 'abc123' }),
    }) as any;

    render(<Index />);
    const input = screen.getByPlaceholderText(/cole sua url/i);
    fireEvent.change(input, { target: { value: 'https://google.com' } });
    fireEvent.click(screen.getByText(/encurtar url/i));

    await waitFor(() => {
      expect(screen.getByText('Copiar')).toBeInTheDocument();
      expect(screen.getByDisplayValue(/abc123/)).toBeInTheDocument();
    });
  });
});

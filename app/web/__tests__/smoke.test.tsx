import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/ui/button';

// Smoke test — the design-system component floor renders without throwing.
// This is the SCAFFOLD: extend it with real feature tests as the app grows.
// The quality gate runs `pnpm test`, so a green build means these pass — the
// only check that covers behavior, not just compilation.
describe('ui smoke', () => {
  it('renders a Button with its label', () => {
    render(<Button>Get started</Button>);
    expect(
      screen.getByRole('button', { name: 'Get started' }),
    ).toBeTruthy();
  });
});

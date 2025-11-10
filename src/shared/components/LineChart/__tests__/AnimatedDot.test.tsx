import { render, screen } from '@testing-library/react';
import AnimatedDot from '../AnimatedDot';

describe('AnimatedDot', () => {
  it('renders with correct props', () => {
    const data = [
      { x: 'Jan', y: 10 },
      { x: 'Feb', y: 20 },
      { x: 'Mar', y: -5 },
    ];
    render(
      <svg>
        <AnimatedDot
          cx={100}
          cy={50}
          r={6}
          data={data}
          fill="#00ff00"
          index={2}
        />
      </svg>
    );
    const dot = screen.getByTestId('animated-dot');
    expect(dot).toBeInTheDocument();
    expect(dot).toHaveAttribute('cx', '100');
    expect(dot).toHaveAttribute('cy', '50');
    expect(dot).toHaveAttribute('r', '6');
    expect(dot).toHaveAttribute('fill', '#00ff00');
  });
});

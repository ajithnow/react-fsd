import React from 'react';
import { DotProps } from 'recharts';

/**
 * AnimatedDot renders a pulsing dot for the last data point in a line chart.
 */
interface AnimatedDotProps extends DotProps {
  index?: number;
  data: { x: string | number; y?: number | null }[];
}

const AnimatedDot: React.FC<AnimatedDotProps> = props => {
  const { cx, cy, index, data, r, fill } = props;
  if (index !== data.length - 1) return null;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      data-testid="animated-dot"
      style={{
        animation: 'pulse 1s infinite',
      }}
    />
  );
};

// Add keyframes for pulse animation (only once)
if (
  typeof document !== 'undefined' &&
  !document.getElementById('pulse-keyframes')
) {
  const style = document.createElement('style');
  style.id = 'pulse-keyframes';
  style.innerHTML = `
    @keyframes pulse {
      0% { opacity: 1; r: 6; }
      50% { opacity: 0.6; r: 5; }
      100% { opacity: 1; r: 6; }
    }
  `;
  document.head.appendChild(style);
}

export default AnimatedDot;

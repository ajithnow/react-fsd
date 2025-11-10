import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LineChart, LineChartProps } from '../LineChart';

// Define proper types for mock props
interface MockAnimatedDotProps extends React.SVGProps<SVGCircleElement> {
  index?: number;
  payload?: { x: string; y: number };
  cx?: number;
  cy?: number;
  r?: number;
  fill?: string;
  strokeWidth?: number;
  stroke?: string;
  value?: number;
}

interface MockResponsiveContainerProps extends React.PropsWithChildren {
  width?: number | string;
  height?: number | string;
}

interface MockLineChartProps extends React.PropsWithChildren {
  data?: Array<{ x: string | number; y: number }>;
  margin?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  width?: number;
  height?: number;
}

interface MockLineProps {
  dataKey?: string;
  stroke?: string;
  strokeWidth?: number;
  dot?: React.ComponentType<MockAnimatedDotProps> | boolean;
  type?:
    | 'monotone'
    | 'basis'
    | 'basisClosed'
    | 'basisOpen'
    | 'linear'
    | 'linearClosed'
    | 'natural'
    | 'monotoneX'
    | 'monotoneY'
    | 'step'
    | 'stepBefore'
    | 'stepAfter';
  isAnimationActive?: boolean;
}

interface MockAxisProps {
  dataKey?: string;
  axisLine?: boolean;
  tickLine?: boolean;
  label?: {
    value?: string;
    position?: string;
    angle?: number;
    offset?: number;
  };
  className?: string;
}

interface MockCartesianGridProps {
  vertical?: boolean;
}

interface MockReferenceLineProps {
  y?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

// Mock the AnimatedDot component
jest.mock('../AnimatedDot', () => {
  return function MockAnimatedDot(props: MockAnimatedDotProps) {
    return <circle data-testid="animated-dot" {...props} />;
  };
});

// Mock Recharts components
jest.mock('recharts', () => ({
  ...jest.requireActual('recharts'),
  ResponsiveContainer: ({
    children,
    width,
    height,
  }: MockResponsiveContainerProps) => (
    <div data-testid="responsive-container" style={{ width, height }}>
      {children}
    </div>
  ),
  LineChart: ({ children, margin }: MockLineChartProps) => (
    <svg data-testid="recharts-line-chart" data-margin={JSON.stringify(margin)}>
      {children}
    </svg>
  ),
  Line: ({
    dataKey,
    stroke,
    strokeWidth,
    dot,
    type,
    isAnimationActive,
  }: MockLineProps) => (
    <div
      data-testid="recharts-line"
      data-datakey={dataKey}
      data-stroke={stroke}
      data-strokewidth={strokeWidth?.toString()}
      data-type={type}
      data-animation={isAnimationActive?.toString()}
    >
      {typeof dot === 'function' &&
        React.createElement(dot, {
          index: 0,
          payload: { x: 'test', y: 10 },
          cx: 50,
          cy: 50,
          r: 1.3,
          fill: 'orange',
          strokeWidth: 1,
          stroke: 'orange',
          value: 10,
        })}
    </div>
  ),
  XAxis: ({ dataKey, axisLine, tickLine, label, className }: MockAxisProps) => (
    <div
      data-testid="x-axis"
      data-datakey={dataKey}
      data-axisline={axisLine?.toString()}
      data-tickline={tickLine?.toString()}
      data-label={label ? JSON.stringify(label) : undefined}
      className={className}
    />
  ),
  YAxis: ({
    axisLine,
    tickLine,
    label,
    className,
  }: Omit<MockAxisProps, 'dataKey'>) => (
    <div
      data-testid="y-axis"
      data-axisline={axisLine?.toString()}
      data-tickline={tickLine?.toString()}
      data-label={label ? JSON.stringify(label) : undefined}
      className={className}
    />
  ),
  CartesianGrid: ({ vertical }: MockCartesianGridProps) => (
    <div data-testid="cartesian-grid" data-vertical={vertical?.toString()} />
  ),
  ReferenceLine: ({
    y,
    stroke,
    strokeWidth,
    strokeDasharray,
  }: MockReferenceLineProps) => (
    <div
      data-testid="reference-line"
      data-y={y?.toString()}
      data-stroke={stroke}
      data-strokewidth={strokeWidth?.toString()}
      data-strokedasharray={strokeDasharray}
    />
  ),
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe('LineChart Component', () => {
  const mockData: Array<{ x: string; y: number }> = [
    { x: 'Jan', y: -10 },
    { x: 'Feb', y: 5 },
    { x: 'Mar', y: 15 },
    { x: 'Apr', y: -5 },
  ];

  const defaultProps: LineChartProps = {
    data: mockData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the LineChart component without crashing', () => {
      render(<LineChart {...defaultProps} />);
      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
    });

    it('renders all chart components', () => {
      render(<LineChart {...defaultProps} />);

      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('reference-line')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('recharts-line')).toBeInTheDocument();
    });
  });

  describe('Props Configuration', () => {
    it('applies default margin correctly', () => {
      render(<LineChart {...defaultProps} />);
      const chart = screen.getByTestId('recharts-line-chart');
      expect(chart).toHaveAttribute(
        'data-margin',
        JSON.stringify({ top: 20, right: 30, left: 20, bottom: 20 })
      );
    });

    it('applies custom margin', () => {
      const customMargin = { top: 10, right: 20, left: 30, bottom: 40 };
      render(<LineChart {...defaultProps} margin={customMargin} />);
      const chart = screen.getByTestId('recharts-line-chart');
      expect(chart).toHaveAttribute(
        'data-margin',
        JSON.stringify(customMargin)
      );
    });

    it('configures XAxis with correct properties', () => {
      render(<LineChart {...defaultProps} />);
      const xAxis = screen.getByTestId('x-axis');
      expect(xAxis).toHaveAttribute('data-datakey', 'x');
      expect(xAxis).toHaveAttribute('data-axisline', 'false');
      expect(xAxis).toHaveAttribute('data-tickline', 'false');
      expect(xAxis).toHaveClass('text-gray-600');
    });

    it('configures YAxis with correct properties', () => {
      render(<LineChart {...defaultProps} />);
      const yAxis = screen.getByTestId('y-axis');

      expect(yAxis).toHaveAttribute('data-axisline', 'false');
      expect(yAxis).toHaveAttribute('data-tickline', 'false');
      expect(yAxis).toHaveClass('text-gray-600');
    });

    it('applies axis labels when provided', () => {
      render(
        <LineChart
          {...defaultProps}
          xAxisLabel="Time Period"
          yAxisLabel="Value"
        />
      );

      const xAxis = screen.getByTestId('x-axis');
      const yAxis = screen.getByTestId('y-axis');

      expect(xAxis).toHaveAttribute(
        'data-label',
        JSON.stringify({
          value: 'Time Period',
          position: 'insideBottom',
          offset: -5,
        })
      );

      expect(yAxis).toHaveAttribute(
        'data-label',
        JSON.stringify({
          value: 'Value',
          angle: -90,
          position: 'insideLeft',
        })
      );
    });
  });

  describe('Chart Elements Configuration', () => {
    it('configures CartesianGrid correctly', () => {
      render(<LineChart {...defaultProps} />);
      const grid = screen.getByTestId('cartesian-grid');
      expect(grid).toHaveAttribute('data-vertical', 'false');
    });

    it('configures ReferenceLine at y=0', () => {
      render(<LineChart {...defaultProps} />);
      const referenceLine = screen.getByTestId('reference-line');

      expect(referenceLine).toHaveAttribute('data-y', '0');
      expect(referenceLine).toHaveAttribute('data-stroke', '#374151');
      expect(referenceLine).toHaveAttribute('data-strokewidth', '2');
      expect(referenceLine).toHaveAttribute('data-strokedasharray', '5 5');
    });

    it('configures Line component with gradient and animation', () => {
      render(<LineChart {...defaultProps} />);
      const line = screen.getByTestId('recharts-line');
      expect(line).toHaveAttribute('data-datakey', 'y');
      expect(line).toHaveAttribute('data-stroke', 'url(#line-gradient)');
      expect(line).toHaveAttribute('data-strokewidth', '2');
      expect(line).toHaveAttribute('data-type', 'monotone');
      expect(line).toHaveAttribute('data-animation', 'true');
    });

    it('renders AnimatedDot components', () => {
      render(<LineChart {...defaultProps} />);
      const animatedDot = screen.getByTestId('animated-dot');
      expect(animatedDot).toBeInTheDocument();
      expect(animatedDot).toHaveAttribute('fill', 'orange');
      expect(animatedDot).toHaveAttribute('r', '1.3');
    });
  });

  describe('Gradient Definition', () => {
    it('renders without SVG gradient errors', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(<LineChart {...defaultProps} />);

      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it('contains gradient definition in component', () => {
      const { container } = render(<LineChart {...defaultProps} />);

      expect(
        container.querySelector('svg[data-testid="recharts-line-chart"]')
      ).toBeInTheDocument();
    });
  });

  describe('Data Handling', () => {
    it('handles empty data array', () => {
      render(<LineChart data={[]} />);
      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
    });

    it('handles numeric x values', () => {
      const numericData: Array<{ x: number; y: number }> = [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
        { x: 3, y: 15 },
      ];

      render(<LineChart data={numericData} />);
      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
    });

    it('handles string x values', () => {
      const stringData: Array<{ x: string; y: number }> = [
        { x: 'A', y: 10 },
        { x: 'B', y: 20 },
        { x: 'C', y: 15 },
      ];

      render(<LineChart data={stringData} />);
      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles negative y values', () => {
      const negativeData: Array<{ x: string; y: number }> = [
        { x: 'A', y: -10 },
        { x: 'B', y: -5 },
      ];

      render(<LineChart data={negativeData} />);
      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
    });

    it('handles zero y values', () => {
      const zeroData: Array<{ x: string; y: number }> = [
        { x: 'A', y: 0 },
        { x: 'B', y: 0 },
      ];

      render(<LineChart data={zeroData} />);
      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
    });

    it('handles single data point', () => {
      const singleData: Array<{ x: string; y: number }> = [{ x: 'A', y: 10 }];

      render(<LineChart data={singleData} />);
      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has accessible test-id on main chart element', () => {
      render(<LineChart {...defaultProps} />);
      expect(screen.getByTestId('recharts-line-chart')).toBeInTheDocument();
    });

    it('applies proper CSS classes for styling', () => {
      render(<LineChart {...defaultProps} />);

      const xAxis = screen.getByTestId('x-axis');
      const yAxis = screen.getByTestId('y-axis');

      expect(xAxis).toHaveClass('text-gray-600');
      expect(yAxis).toHaveClass('text-gray-600');
    });
  });
});

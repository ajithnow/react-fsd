import React from 'react';
import AnimatedDot from './AnimatedDot';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

export interface LineChartProps {
  yTickInterval?: number;
  data: { x: string | number; y?: number | null }[];
  width?: number;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
  margin?: { top?: number; right?: number; left?: number; bottom?: number };
  yDomain?: [number, number];
  // Optional numeric X domain and ticks (e.g., [0,24] and [0,2,4,...,24])
  xDomain?: [number, number];
  xTicks?: number[];
  // Optional explicit Y ticks (if provided, overrides generated ticks)
  yTicks?: number[];
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xAxisLabel,
  yAxisLabel,
  width = 500,
  height = 300,
  margin = { top: 20, right: 30, left: 20, bottom: 20 },
  yDomain,
  yTickInterval,
  xDomain,
  xTicks,
  yTicks,
}) => {
  // Gradient id for SVG
  const gradientId = 'line-gradient';

  // Find min and max Y
  const yValues = data
    .map(d => d.y)
    .filter((y): y is number => typeof y === 'number');
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  // Calculate offset for y=0
  let zeroOffset = 0;
  if (maxY !== minY) {
    zeroOffset = ((maxY - 0) / (maxY - minY)) * 100;
    zeroOffset = Math.max(0, Math.min(100, zeroOffset));
  } else {
    zeroOffset = 50;
  }

  // Generate Y axis ticks if interval is provided and explicit yTicks not provided
  let generatedYTicks: number[] | undefined = undefined;
  if (!yTicks && yDomain && yTickInterval && yTickInterval > 0) {
    const [min, max] = yDomain;
    generatedYTicks = [];
    const start = Math.ceil(min / yTickInterval) * yTickInterval;
    const end = Math.floor(max / yTickInterval) * yTickInterval;
    for (let t = start; t <= end; t += yTickInterval) {
      generatedYTicks.push(Number(t.toFixed(6)));
    }
    // Ensure min and max are included
    if (!generatedYTicks.includes(min)) generatedYTicks.push(min);
    if (!generatedYTicks.includes(max)) generatedYTicks.push(max);
    // Always include zero if in domain
    if (0 >= min && 0 <= max && !generatedYTicks.includes(0))
      generatedYTicks.push(0);
    generatedYTicks = Array.from(new Set(generatedYTicks)).sort(
      (a, b) => a - b
    );
  }

  return (
    <ReLineChart
      width={width}
      height={height}
      data={data}
      margin={margin}
      data-testid="recharts-line-chart"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
          <stop offset={`${zeroOffset}%`} stopColor="#fbbf24" stopOpacity={1} />
          <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="x"
        type={xDomain ? ('number' as const) : undefined}
        domain={xDomain}
        ticks={xTicks}
        axisLine={false}
        tickLine={false}
        label={
          xAxisLabel
            ? { value: xAxisLabel, position: 'insideBottom', offset: -5 }
            : undefined
        }
        className="text-gray-600"
        tick={{ fontSize: 12 }}
        interval={0}
        tickFormatter={value => {
          const n =
            typeof value === 'number' ? value : parseInt(String(value), 10);
          if (!Number.isNaN(n)) {
            if (n === 24) return '24';
            return n % 2 === 0 ? String(n) : '';
          }
          return String(value ?? '');
        }}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        domain={yDomain}
        ticks={yTicks ?? generatedYTicks}
        interval={0}
        tickFormatter={v => (Math.abs(v) < 1e-6 ? '0' : v.toString())}
        label={
          yAxisLabel
            ? {
                value: yAxisLabel,
                angle: -90,
                position: 'insideLeft',
                offset: -10,
              }
            : undefined
        }
        className="text-gray-600"
      />
      <ReferenceLine
        y={0}
        stroke="#374151"
        strokeWidth={2}
        strokeDasharray="5 5"
      />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="y"
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
        dot={props => (
          <AnimatedDot
            {...props}
            data={data}
            fill="orange"
            r={1.3}
            key={props.index}
          />
        )}
        isAnimationActive={true}
      />
    </ReLineChart>
  );
};

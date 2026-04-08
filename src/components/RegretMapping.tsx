import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { DayLog } from '../types';

interface RegretMappingProps {
  logs: DayLog[];
}

const COLORS = ['#4C22ED', '#F310F6', '#FDEE88', '#FF5733', '#000000', '#00D1FF'];

export default function RegretMapping({ logs }: RegretMappingProps) {
  const categoryData: Record<string, { totalIntensity: number; count: number }> = {};

  logs.forEach(log => {
    log.decisions.forEach(decision => {
      if (!categoryData[decision.category]) {
        categoryData[decision.category] = { totalIntensity: 0, count: 0 };
      }
      categoryData[decision.category].totalIntensity += decision.regretIntensity;
      categoryData[decision.category].count += 1;
    });
  });

  const data = Object.entries(categoryData)
    .map(([name, stats]) => ({
      name,
      value: Math.round(stats.totalIntensity / stats.count),
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-black/30 text-sm">
        No data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 48, bottom: 8, left: 8 }}
        barCategoryGap="25%"
      >
        <XAxis
          type="number"
          domain={[0, 100]}
          tickFormatter={v => `${v}%`}
          tick={{ fontSize: 10, fill: '#666' }}
          axisLine={false}
          tickLine={false}
          ticks={[0, 25, 50, 75, 100]}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={80}
          tick={{ fontSize: 11, fill: '#000', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} isAnimationActive={true} animationDuration={800}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="black" strokeWidth={2} />
          ))}
          <LabelList
            dataKey="value"
            position="right"
            formatter={(v: number) => `${v}%`}
            style={{ fontSize: 11, fontWeight: 700, fill: '#000' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

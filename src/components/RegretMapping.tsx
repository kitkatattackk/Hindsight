import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DayLog } from '../types';

interface RegretMappingProps {
  logs: DayLog[];
}

export default function RegretMapping({ logs }: RegretMappingProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || logs.length === 0) return;

    // Process data: Average regret intensity per category
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

    const data = Object.entries(categoryData).map(([name, stats]) => ({
      name,
      value: Math.round(stats.totalIntensity / stats.count),
      count: stats.count
    })).sort((a, b) => b.value - a.value);

    const COLORS = ['#4C22ED', '#F310F6', '#FDEE88', '#FF5733', '#000000', '#FFFFFF'];

    // D3 Visualization logic
    const width = 400;
    const height = 400;
    const margin = { top: 20, right: 60, bottom: 40, left: 130 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const x = d3.scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.25);

    // Add Grid Lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x)
        .ticks(5)
        .tickSize(-(height - margin.top - margin.bottom))
        .tickFormat(() => "")
      )
      .call(g => g.select(".domain").remove())
      .selectAll("line")
      .attr("stroke", "#eee")
      .attr("stroke-dasharray", "3,3");

    // Add bars
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0))
      .attr("y", d => y(d.name)!)
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .attr("fill", (d, i) => COLORS[i % COLORS.length])
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("rx", 8)
      .transition()
      .duration(1000)
      .attr("width", d => x(d.value) - x(0));

    // Add labels
    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.value) + 8)
      .attr("y", d => y(d.name)! + y.bandwidth() / 2)
      .attr("dy", ".35em")
      .text(d => `${d.value}%`)
      .style("font-family", "'Fredoka', sans-serif")
      .style("font-size", "12px")
      .style("fill", "#000")
      .style("opacity", 0)
      .transition()
      .delay(800)
      .style("opacity", 1);

    // Add axes
    const xAxis = svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${d}%`));
    
    xAxis.call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").remove());
    
    xAxis.selectAll("text")
      .style("font-family", "'Fredoka', sans-serif")
      .style("font-size", "10px")
      .style("fill", "#666");

    const yAxis = svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
    
    yAxis.call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").remove());
    
    yAxis.selectAll("text")
      .style("font-family", "'Fredoka', sans-serif")
      .style("font-size", "11px")
      .style("fill", "#000")
      .attr("dx", "-10px");

  }, [logs]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg 
        ref={svgRef} 
        viewBox="0 0 400 400" 
        className="w-full h-full"
      />
    </div>
  );
}

import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function ScatterPlot(props: any): any {
  const ref = useRef(null);
  const height = 800;
  const width = 800;
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };

  const xValue = (d: any): number => d["x"];
  const yValue = (d: any): number => d["y"];

  const currentPath = d3.select(ref.current)
    .select(".plot-area");

  useEffect(
    () => {
      const maxX = d3.max(props.data, xValue) || 0;
      const maxY = d3.max(props.data, yValue) || 0;

      const minX = d3.min(props.data, xValue) || 0;
      const minY = d3.min(props.data, yValue) || 0;

      const xScale = d3
        .scaleLinear()
        .domain([minX, maxX])
        .range([margin.left, width - margin.right]);

      const yScale = d3
        .scaleLinear()
        .domain([minY, maxY])
        .range([height - margin.bottom, margin.top]);


      d3.select(ref.current)
        .attr("viewBox", "0 0 " + width  + " " + height)
        .attr("width", "100%")
        .attr("height", "100%");

      currentPath.selectAll('circle')
        .data(props.data)
        .enter()
        .append("circle")
        .attr("cx", (d: any) => {
          return xScale(d["x"]);
        })
        .attr("cy", (d: any) => {
          return yScale(d["y"]);
        })
        .attr("r", 2)
        .style("fill", "red")
        .attr("stroke", "white");

      if (!currentPath.select(".axisBottom").node()) {
        currentPath.append("g")
          .attr("class", "axisBottom")
          .attr("transform", "translate(0," + (height - margin.bottom) + ")")
          .call(d3.axisBottom(xScale));
      }

      if (!currentPath.select(".axisLeft").node()) {
        currentPath.append("g")
          .attr("class", "axisLeft")
          .attr("transform", "translate(" + margin.left + "," + 0 + ")")
          .call(d3.axisLeft(yScale));
      }
    },
    [ props.data ]
  )
  return (
    <svg
      ref={ref}
      style={{
        height: "100%",
        width: "100%",
        marginBottom: "100px",
        marginTop: "0px",
        marginLeft: "0px",
      }}
    >
      <g className="plot-area" />
    </svg>
  );
}

export default ScatterPlot;

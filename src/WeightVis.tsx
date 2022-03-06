import * as d3 from 'd3';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { getMergedPathData, getMergedPath } from './d3_utils'

function WeightVis (props: any): any {
  const ref = useRef(null);
  const [data, setData] = useState<Array<number>>([]);

  const height = 400;
  const width = 2000;

  const margin = useMemo(() => {
    return { top: 50, right: 50, bottom: 50, left: 50 };
  }, []);

  const currentPath = d3.select(ref.current)
    .select(".bar-plot-area");

  useEffect(
    () => {

      if (props?.data.length > 0)
        setData(props?.data);
      else
        setData([0]); // set default

      const maxX: number = data.length || 0;
      const maxY: number = d3.max(data) as number || 0;

      const minX: number = 0;
      const minY: number = d3.min(data) || 0;;

      const xScale = d3
        .scaleLinear()
        .domain([minX, maxX])
        .range([margin.left, width - margin.right]);

      const yScale = d3
        .scaleLinear()
        .domain([Math.min(minY, 0), Math.max(maxY, 0)])
        .range([height - margin.bottom, margin.top]);

      d3.select(ref.current)
        .attr("viewBox", "0 0 " + width  + " " + height)
        .attr("width", "100%")
        .attr("height", "100%");

      getMergedPath(currentPath, "g", "axisBottom")
        .attr("class", "axisBottom")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(xScale));

      getMergedPath(currentPath, "g", "axisLeft")
        .attr("class", "axisLeft")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        .call(d3.axisLeft(yScale));

      const dataWidth = (width - margin.left * 2) / (data.length * 2)
      getMergedPathData(currentPath, "rect", "bar", props.data)
        .attr("x", (d: number, i: number) => xScale(i) + dataWidth/2)
        .attr("y", (d: number) => yScale(d))
        .attr("width", dataWidth)
        .attr("height", (d: number) =>  {
          return height - margin.top - yScale(d);
        })
        .attr("class", "bar")
        .style("fill", (d: any, i: number) => {
          return d3.schemeCategory10[0]
        })
        .attr("stroke", "white");
    },
  [ props?.data, margin, currentPath, data ]);

  return (
    <svg
      ref={ref}
      style={{
        height: "100px",
        width: "100%",
      }}
    >
      <g className="bar-plot-area" />
    </svg>
  )
}

export default WeightVis;

import * as d3 from 'd3';
import { useRef, useMemo } from 'react';
import { getMergedPathData, getMergedPath } from './d3_utils'
import useDeepCompareEffect from 'use-deep-compare-effect';

function ScatterPlot(props: any): any {
  const ref = useRef(null);
  const height = 800;
  const width = 800;

  const margin = useMemo(() => {
    return { top: 50, right: 50, bottom: 50, left: 50 };
  }, []);

  const xValue = (d: any): number => d["x"];
  const yValue = (d: any): number => d["y"];

  const currentPath = d3.select(ref.current)
    .select(".plot-area");

  useDeepCompareEffect(
    () => {
      const maxX = d3.max(props.data, xValue) || 0;
      const maxY = d3.max(props.data, yValue) || 0;

      const minX = d3.min(props.data, xValue) || 0;
      const minY = d3.min(props.data, yValue) || 0;

      const tooltip = d3.select("#visContainer")
        .append("div")
        .attr("class", "tooltip")
        .style("font-size", "14px")
        .style("text-align", "left")
        .style("position", "absolute");

      const xScale = d3
        .scaleLinear()
        .domain([minX, maxX])
        .range([margin.left, width - margin.right]);

      const yScale = d3
        .scaleLinear()
        .domain([minY, maxY])
        .range([height - margin.bottom, margin.top]);

      const colorScale = d3.scaleOrdinal()
        .domain(props.labels.filter((e: any, i: number, self: Array<any>) => self.indexOf(e) === i))
        .range(d3.schemeCategory10);

      d3.select(ref.current)
        .attr("viewBox", "0 0 " + width  + " " + height)
        .attr("width", "100%")
        .attr("height", "100%");

      getMergedPathData(currentPath, "circle", "dataPoint", props.data)
        .attr("cx", (d: any) => {
          return xScale(d["x"]);
        })
        .attr("cy", (d: any) => {
          return yScale(d["y"]);
        })
        .attr("r", 2)
        .attr("class", "dataPoint")
        .style("fill", (_: any, i: number) => {
          return colorScale(props.labels[i]);
        })
        .attr("stroke", "white")
        .on("mouseover", (e: any) => {
					const d = e.target.__data__;
          tooltip
						.style("visibility", "visible")
						.html(
              "x: " + d.x.toFixed(4) + '</br>'
              + "y: " + d.y.toFixed(4)
            );
				})
				.on("mousemove", (e: any) => {
					tooltip
						.style("top", (e.pageY - 20) + "px")
						.style("left", (e.pageX + 10) + "px");
				})
				.on("mouseout", (_: any) => {
					tooltip.style("visibility", "hidden");
				});

      getMergedPath(currentPath, "g", "axisBottom")
        .attr("class", "axisBottom")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(xScale));

      getMergedPath(currentPath, "g", "axisLeft")
        .attr("class", "axisLeft")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        .call(d3.axisLeft(yScale));
    },
    [ props, currentPath, margin ]
  )

  return (
    <div id="visContainer">
      <svg
        ref={ref}
        style={{
          height: "100%",
          width: "100%",
          minWidth: "600px",
          margin: "18% 50px 0 0"
        }}
      >
        <g className="plot-area" />
      </svg>
    </div>
  );
}

export default ScatterPlot;

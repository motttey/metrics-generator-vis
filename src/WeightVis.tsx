import * as d3 from 'd3';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { getMergedPathData, getMergedPath } from './d3_utils'

function WeightVis (props: any): any {
  const ref = useRef(null);
  const [data, setData] = useState<Array<number>>([]);

  const height = 300;
  const width = 2000;

  const margin = useMemo(() => {
    return { top: 50, right: 50, bottom: 50, left: 50 };
  }, []);

  const currentPath = d3.select(ref.current)
    .select(".bar-plot-area");

  const handleChange = (i: number, d: any) => {
    // k有効数字3けたまでで一致する
    if (data[i] && d.toFixed(3) != data[i].toFixed(3)) {
      data[i] = d;
      props.handleWeightChange(JSON.parse(JSON.stringify(data)));
    }
  }

  useEffect(() => {
    if (props?.data.length > 0)
      setData(props?.data);
    else
      setData([0]); // set default

  }, [ props?.data ])

  useEffect(
    () => {
      const maxX: number = data.length || 0;
      const maxY: number = d3.max(data) as number || 0;

      const minX = 0;
      const minY: number = d3.min(data) || 0;

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

      /*
      getMergedPath(currentPath, "g", "axisLeft")
        .attr("class", "axisLeft")
        .attr("transform", "translate(" + margin.left + "," + 0 + ")")
        .call(d3.axisLeft(yScale));
      */
      
      const dataWidth = (width - margin.left * 2) / (data.length * 2)
      getMergedPathData(currentPath, "rect", "bar", props.data)
        .attr("x", (_: number, i: number) => xScale(i) + dataWidth/2)
        .attr("y", (d: number) => yScale(d))
        .attr("width", dataWidth)
        .attr("height", (d: number) =>  {
          return height - margin.top - yScale(d);
        })
        .attr("class", "bar")
        .style("fill", (_: any) => {
          // return d3.schemeCategory10[i % d3.schemeCategory10.length]
          return d3.schemeCategory10[0]
        })
        .attr("stroke", "white");

      // bar chartの上にbrushを追加
      getMergedPathData(currentPath, "g", "brushes", props.data)
        .attr("class","brushes")
        .attr("id", (_: any, i: number) => i.toString())
        .each((_: any, idx: number, arr: any) =>  {
          const brushY =  d3.brushY()
            .extent([
              [xScale(idx) + dataWidth/2, 0],
              [xScale(idx) + dataWidth * 1.5, height]
            ])
            .on("end", (_self: any, _: any) => {
              const selection = _self.selection;
              if (selection && selection[0] != 0) {
                handleChange(idx, yScale.invert(selection[0]));
              }
            });

          d3.select(arr[idx])
            .call(brushY)
            .call(brushY.move, (d: number) => {
              return (d > 0)? [d, 0].map(yScale): [0, d].map(yScale);
            })
        });
    },
  [ props?.data, margin, currentPath, data ]);

  return (
    <svg
      ref={ref}
      style={{
        height: "100px",
        width: "100%",
        maxWidth: "500px"
      }}
    >
      <g className="bar-plot-area" />
    </svg>
  )
}

export default WeightVis;

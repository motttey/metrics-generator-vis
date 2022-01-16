import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@material-ui/core';

function WeightVis(props: any): any {
  const ref = useRef(null);
  const [data, setData] = useState<Array<number>>([]);

  useEffect(
    () => {
      setData(props?.data)
    },
    [ props?.data ]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    data[parseInt(e.target.name)] = parseFloat(e.target.value);
    props.handleWeightChange(JSON.parse(JSON.stringify(data)));
  }

  return (
    /*
    <svg
      ref={ref}
      style={{
        height: "100px",
        width: "100%",
      }}
    >
      <g className="bar-plot-area" />
    </svg>
    */
    <form>
      {
        data.map((weight: number, index: number) => {
          return (
            <Input
              onChange={handleChange}
              style= {{
                width: "75px",
                margin: "5px",
                color: "white"
              }}
              color="primary"
              type="number"
              key={index}
              name={index.toString()}
              value={weight.toFixed(4)}
            />
          )
        })

      }
    </form>
  );
}

export default WeightVis;

import React, { useRef, useEffect } from 'react';
import { Input } from '@material-ui/core';

function WeightVis(props: any): any {
  const ref = useRef(null);

  useEffect(
    () => {
      console.log(props?.data)
    },
    [ props?.data ]
  )

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
        props?.data.map((weight: number, index: number) => {
          return (
            <Input
              readOnly
              style= {{
                width: "75px",
                margin: "5px",
                color: "white"
              }}
              color="primary"
              type="number"
              key={index}
              value={weight.toFixed(4)}
            />
          )
        })

      }
    </form>
  );
}

export default WeightVis;

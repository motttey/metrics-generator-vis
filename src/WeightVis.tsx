import React, { useRef, useEffect } from 'react';

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
            <input
              readOnly
              style= {{
                width: "75px",
                margin: "5px"
              }}
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

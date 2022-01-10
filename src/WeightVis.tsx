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
    <div>
      { props?.data }
    </div>
  );
}

export default WeightVis;

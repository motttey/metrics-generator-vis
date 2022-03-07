import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';

function WeightForm (props: any): any {
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
    <form>
      {
        data.map((weight: number, index: number) => {
          return (
            <TextField
              onChange={handleChange}
              style= {{
                width: "100px",
                margin: "5px",
                backgroundColor: "currentColor"
              }}
              key={index}
              name={index.toString()}
              value={weight.toFixed(4)}
              label={props.attributeLabelNameList[index] || 'unknown'}
            />
          )
        })
      }
    </form>
  );
}

export default WeightForm;

import React, { useState, useEffect } from 'react';
import { FormControl, MenuItem, Select } from '@material-ui/core';

function OpCodeForm (props: any): any {
  const [operation, setOperation] = useState<string>("x");

  useEffect(
    () => {
      setOperation(props?.data)
    },
    [ props?.data ]
  )

  return (
    <FormControl fullWidth>
      <Select
        id="operation-select"
        value={operation}
        label="Operation"
        style= {{
          color: "white"
        }}
      >
        <MenuItem value={"+"}>+</MenuItem>
        <MenuItem value={"x"}>x</MenuItem>
        <MenuItem value={"/"}>/</MenuItem>
      </Select>
    </FormControl>
  )
}

export default OpCodeForm;

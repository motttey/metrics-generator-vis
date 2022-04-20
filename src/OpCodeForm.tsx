
import React, { useState, useEffect } from 'react';
import { FormControl, List, ListItem, MenuItem, Select } from '@material-ui/core';

function OpCodeForm (props: any): any {
  const [operation, setOperation] = useState<Array<string>>([]);

  useEffect(
    () => {
      console.log(props?.data)
      setOperation(props?.data)
    },
    [ props?.data ]
  )

  return (
    <List
      className="weightForm"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 40px"
      }}
    >
      {operation.map((op: string, index: number) => {
        return (
          <ListItem
            key={index}
          >
            <FormControl fullWidth>
              <Select
                id="operation-select"
                value={op}
                label="Operation"
                style= {{
                  color: "white"
                }}
                color="secondary"
              >
                <MenuItem value={"+"}>+</MenuItem>
                <MenuItem value={"x"}>x</MenuItem>
                <MenuItem value={"/"}>/</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        );
      })}
    </List>
  )
}

export default OpCodeForm;

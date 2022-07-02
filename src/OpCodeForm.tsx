
import React, { useState, useEffect } from 'react';
import { FormControl, List, ListItem, MenuItem, Select } from '@mui/material';

function OpCodeForm (props: any): any {
  const [operation, setOperation] = useState<Array<string>>([]);

  const handleSelect = (
    e: React.MouseEvent<HTMLElement>,
    code: string,
    index: number
  ) => {
    operation[index] = code;
    props.handleOpeChange(JSON.parse(JSON.stringify(operation)));
  }

  useEffect(
    () => {
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
                label="Operation"
                style= {{
                  color: "white"
                }}
                color="secondary"
                name={index.toString()}
                value={op}
              >
                {
                  ["+", "x", "/"].map((code: string, i: number) => {
                    return (
                      <MenuItem
                        key={i}
                        value={code}
                        onClick={(event) => handleSelect(event, code, index)}
                      >
                        {code}
                      </MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          </ListItem>
        );
      })}
    </List>
  )
}

export default OpCodeForm;

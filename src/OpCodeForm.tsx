
import { useState, useMemo } from 'react';
import { FormControl, List, ListItem, MenuItem, Select } from '@mui/material';

const OPERATION_LIST = ["+", "x", "/"]

function OpCodeForm (props: any): any {
  const [operation, setOperation] = useState<Array<string>>([]);

  const selectStyle = {
    color: "white",
    borderColor: 'white',
    borderRadius: "10px",
    outlineColor: 'white',
    outline: '1px solid white'
  }

  const handleSelect = (
    code: string,
    index: number
  ) => {
    props.handleOpeChange([
      ...operation.slice(0, index),
      code,
      ...operation.slice(index + 1)
    ]);
  }

  useMemo(() => {
    setOperation(props?.data);
  }, [props?.data]);

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
                name={index.toString()}
                label="Operation"
                sx={selectStyle}
                color="primary"
                variant="outlined"
                value={op}
              >
                {
                  OPERATION_LIST.map((code: string, i: number) => {
                    return (
                      <MenuItem
                        key={i}
                        value={code}
                        onClick={() => handleSelect(code, index)}
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

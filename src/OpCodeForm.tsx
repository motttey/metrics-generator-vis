import { useState, useMemo } from "react";
import { FormControl, List, ListItem, MenuItem, Select } from "@mui/material";

const OPERATION_LIST = ["+", "x", "/"];

const getOperationKey = (
  operations: string[],
  operation: string,
  position: number,
) =>
  `${operation}-${operations.slice(0, position).filter((value) => value === operation).length}`;

function OpCodeForm(props: any): any {
  const [operation, setOperation] = useState<Array<string>>([]);

  const selectStyle = {
    color: "white",
    borderColor: "white",
    borderRadius: "10px",
    outlineColor: "white",
    outline: "1px solid white",
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  };

  const handleSelect = (code: string, index: number) => {
    props.handleOpeChange([
      ...operation.slice(0, index),
      code,
      ...operation.slice(index + 1),
    ]);
  };

  useMemo(() => {
    setOperation(props?.data);
  }, [props?.data]);

  return (
    <List
      className="weightForm"
      aria-label="Operation selection"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
      }}
    >
      {operation.map((op: string, index: number) => {
        return (
          <ListItem key={getOperationKey(operation, op, index)}>
            <FormControl fullWidth>
              <Select
                id="operation-select"
                name={index.toString()}
                label="Operation"
                sx={selectStyle}
                color="primary"
                variant="outlined"
                value={op}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: "white",
                    },
                  },
                }}
              >
                {OPERATION_LIST.map((code: string) => {
                  return (
                    <MenuItem
                      key={code}
                      value={code}
                      onClick={() => handleSelect(code, index)}
                    >
                      {code}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </ListItem>
        );
      })}
    </List>
  );
}

export default OpCodeForm;

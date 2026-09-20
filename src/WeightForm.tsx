import React, { useState, useMemo } from "react";
import {
  FormControl,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DraggableProvided,
  DroppableProvided,
} from "react-beautiful-dnd";

function WeightForm(props: any): any {
  const [data, setData] = useState<Array<number>>([]);
  const operationList = ["+", "x", "/"];

  const getWeightKey = (weight: number, position: number) => {
    const label = props.attributeLabelNameList[position] || "unknown";
    const repeatedLabels = props.attributeLabelNameList
      .slice(0, position)
      .filter((previousLabel: string) => previousLabel === label).length;

    return `${label}-${repeatedLabels}-${weight}`;
  };

  useMemo(() => {
    setData(props?.data);
  }, [props?.data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    props.handleWeightChange([
      ...data.slice(0, index),
      parseFloat(e.target.value),
      ...data.slice(index + 1),
    ]);
  };

  const handleDragEnd = (res: any) => {
    if (!res.destination) {
      return;
    }
    const tmpData = [...data];
    const [reorderedData] = tmpData.splice(res.source.index, 1);
    tmpData.splice(res.destination.index, 0, reorderedData);

    setData(tmpData);
  };

  const handleOperationChange = (operation: string, index: number) => {
    props.handleOpeChange([
      ...props.operation.slice(0, index),
      operation,
      ...props.operation.slice(index + 1),
    ]);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="weightForm">
        {(provided: DroppableProvided) => (
          <List
            className="weightForm"
            style={{
              display: "flex",
              flexDirection: "row",
              padding: 0,
            }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {data.map((weight: number, index: number) => (
              <React.Fragment key={getWeightKey(weight, index)}>
                <Draggable
                  draggableId={getWeightKey(weight, index)}
                  index={index}
                >
                  {(provided: DraggableProvided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TextField
                        className="weight-input"
                        variant="outlined"
                        size="small"
                        type="number"
                        inputProps={{ step: "0.0001" }}
                        sx={{
                          width: "calc(6rem)",
                          "& .MuiOutlinedInput-root": {
                            color: "white",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                            "& fieldset": {
                              borderColor: "rgba(255, 255, 255, 0.7)",
                            },
                            "&:hover fieldset": { borderColor: "white" },
                            "&.Mui-focused fieldset": { borderColor: "white" },
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgba(255, 255, 255, 0.82)",
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "white",
                          },
                          "& input": { textAlign: "center" },
                        }}
                        name={index.toString()}
                        value={weight.toFixed(4)}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(e, index)
                        }
                        label={props.attributeLabelNameList[index] || "unknown"}
                      />
                    </ListItem>
                  )}
                </Draggable>
                {index < data.length - 1 && (
                  <ListItem className="operation-item">
                    <FormControl size="small">
                      <Select
                        className="operation-select"
                        aria-label={`${props.attributeLabelNameList[index]} operation`}
                        value={props.operation[index] || "+"}
                        onChange={(event) =>
                          handleOperationChange(event.target.value, index)
                        }
                        sx={{
                          color: "#fff",
                          "& .MuiSelect-select": { color: "#fff" },
                          "& .MuiSvgIcon-root": { color: "#fff" },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              color: "white",
                              backgroundColor: "#343942",
                            },
                          },
                        }}
                      >
                        {operationList.map((operation) => (
                          <MenuItem
                            key={operation}
                            value={operation}
                            sx={{ color: "white" }}
                          >
                            {operation}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </ListItem>
                )}
              </React.Fragment>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default WeightForm;

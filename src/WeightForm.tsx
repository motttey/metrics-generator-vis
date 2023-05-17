import React, { useState, useMemo } from 'react';
import { TextField, List , ListItem } from '@mui/material';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DraggableProvided,
  DroppableProvided
} from 'react-beautiful-dnd';

function WeightForm (props: any): any {
  const [data, setData] = useState<Array<number>>([]);

  useMemo(
    () => {
      setData(props?.data)
    },
    [ props?.data ]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    props.handleWeightChange([
      ...data.slice(0, index),
      parseFloat(e.target.value),
      ...data.slice(index + 1)
    ]);
  }

  const handleDragEnd = (res: any) => {
    if (!res.destination) {
      return;
    }
    const tmpData = [...data];
    const [ reorderedData ] = tmpData.splice(res.source.index, 1)
    tmpData.splice(res.destination.index, 0, reorderedData);

    setData(tmpData);
  }

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
              {data.map((weight: number, index: number) => {
                return (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided: DraggableProvided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TextField
                          variant="standard"
                          style= {{
                            width: "80px",
                            margin: "15px",
                            backgroundColor: "currentColor"
                          }}
                          key={index}
                          name={index.toString()}
                          value={weight.toFixed(4)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
                          label={props.attributeLabelNameList[index] || 'unknown'}
                        />
                      </ListItem>
                    )}
                  </Draggable>
                )}
              )}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
  );
}

export default WeightForm;

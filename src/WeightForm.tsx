import React, { useState, useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

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

  const handleDragEnd = (res: any) => {
    const tmpData = Array.from(data);
    const [ reorderedData ] = tmpData.splice(res.source.index, 1)
    tmpData.splice(res.destination.index, 0, reorderedData);

    setData(tmpData);
  }

  return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="weightForm">
          {(provided) => (
            <form
              className="weightForm"
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
                    {(provided) => (
                      <TextField
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onChange={handleChange}
                        style= {{
                          width: "100px",
                          margin: "10px",
                          backgroundColor: "currentColor"
                        }}
                        key={index}
                        name={index.toString()}
                        value={weight.toFixed(4)}
                        label={props.attributeLabelNameList[index] || 'unknown'}
                      />
                    )}
                  </Draggable>
                )}
              )}
              {provided.placeholder}
            </form>
          )}
        </Droppable>
      </DragDropContext>
  );
}

export default WeightForm;

import React from 'react';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

interface LoadedDataProps {
  errors: any[];
  csvRows: { field: string; headerName: string }[];
  csvColumns: any[];
  targetValColumn: string;
  onTargetValColumnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function LoadedData(props: LoadedDataProps): JSX.Element {
  const { errors, csvRows, targetValColumn, onTargetValColumnChange } = props;

  return (
    <div id="loadedData">
      {errors.length > 0 && (
        <div className="row">
          {errors.map((error: any, index: number) => (
            <p key={index}>{error.message}</p>
          ))}
        </div>
      )}
      {csvRows.length > 0 && (
        <div className="row">
          <FormControl component="fieldset" sx={{color: "white", width: "100%"}}>
            <FormLabel component="legend" sx={{color: "white", textAlign: "left"}}>Select Target Variable</FormLabel>
            <RadioGroup
              row
              aria-label="target-variable"
              name="target-variable"
              value={targetValColumn}
              onChange={onTargetValColumnChange}
            >
              {csvRows.map((row: any) => (
                <FormControlLabel 
                  key={row.field} 
                  value={row.field} 
                  control={<Radio sx={{color: "white", '&.Mui-checked': {color: "white"}}}/>} 
                  label={row.headerName} 
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>
      )}
      {/*
      {csvColumns.length > 0 && (
         <div style={{ height: 400, width: '100%', color: "black", backgroundColor: "white", overflow: "auto" }}>
           <table style={{width: "100%"}}>
            <thead>
              <tr>
                {csvRows.map(col => <th key={col.field}>{col.headerName}</th>)}
              </tr>
            </thead>
            <tbody>
              {csvColumns.slice(0, 10).map((row, i) => (
                <tr key={i}>
                  {csvRows.map(col => <td key={col.field}>{row[col.field]}</td>)}
                </tr>
              ))}
            </tbody>
           </table>
           {csvColumns.length > 10 && <p>... and {csvColumns.length - 10} more rows</p>}
        </div>
      )}
      */}
    </div>
  );
}

export default LoadedData;

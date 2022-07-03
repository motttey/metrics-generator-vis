import React, { useState, useEffect } from 'react';
import ScatterPlot from './ScatterPlot';
import WeightForm from './WeightForm';
import WeightVis from './WeightVis';
import OpCodeForm from './OpCodeForm';

import { Button, ThemeProvider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { createTheme } from '@mui/material/styles';

import * as d3 from 'd3';
import Papa from 'papaparse';

import './App.css';

import useDeepCompareEffect from 'use-deep-compare-effect';

const getOperation = (v1: number, v2: number, opCode: string) => {
  if (opCode === "+") {
    return v1 + v2;
  } else if (opCode === "x") {
    return v1 * v2;
  } else if (opCode === "/") {
    return v1 / v2;
  } else {
    return v1;
  }
}

const getPosition = (
  arr: Array<number>,
  operation: Array<string>
) => {
  let result = 0.0;
  arr.forEach((v: number, i: number) => {
    if (i === 0) {
      result = v;
    } else {
      result = getOperation(result, v, operation[i - 1]);
    }
  });
  return result;
}

const getWeightedPos = (
  arr: Array<any>,
  w: Array<number>,
  operation: Array<string>
) => {
  return getPosition(arr.map((v: any, i: number) => v * w[i]), operation)
}

const iris_url = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv';

const attributeColumn = "Species";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
      contrastText: "#282c34"
    }
  }
})

function App() {
  const [dataArray, setDataArray] = useState<Array<any>>([]);
  const [irisData, setIrisData] = useState<Array<any>>([]);
  const [targetValData, setTargetValData] = useState<Array<any>>([]);
  const [attributeLabels, setAttributeLabels] = useState<Array<string>>([]);

  const [wX, setWX] = useState<Array<number>>([]);
  const [wY, setWY] = useState<Array<number>>([]);

  const [operationX, setOperationX] = useState<Array<string>>([]);
  const [operationY, setOperationY] = useState<Array<string>>([]);

  const randomizeWeight = (_: any) => {
    setWX(wX.map((_: any) => Math.random()));
    setWY(wY.map((_: any) => Math.random()));
  }

  const [errors, setErrors] = useState<Array<any>>([]);
  const [csvColumn, setCsvColumn] = useState<Array<any>>([]);
  const [csvRows, setCsvRows] = useState<Array<any>>([]);
  const [csvData, setCsvData] = useState<any>({});

  const[weightObj, setWeightObj] = useState<any>({
    "x": wX,
    "y": wY
  });

  useEffect(() => {
    d3.csv(iris_url).then((data: any) => {
      const columns = data.columns;
      const arr = data.map((d: any) => {
        return Object.values(d).slice(0, columns.length - 1)
          .map((v: any) => parseFloat(v));
      });

      setTargetValData(data.map((d: any) => d[attributeColumn]));
      setDataArray(arr);
      const attributes = columns
        .filter((c: string) => c !== attributeColumn);
      setAttributeLabels(attributes)

      setWX(attributes.map((_: any) => Math.random()));
      setWY(attributes.map((_: any) => Math.random()));

      setOperationX(attributes.slice(1).map((_: any) => "+"));
      setOperationY(attributes.slice(1).map((_: any) => "+"));
    }).catch((error: any) => {
      console.log(error);
      setDataArray([]);
    });
  }, []);

  useEffect(() => {
    setWeightObj({
      "x": wX,
      "y": wY
    });
  }, [wX, wY]);

  useEffect(() => {
    const res = dataArray.map((d: any, i: number) => new Object({
      x: getWeightedPos(d, weightObj["x"], operationX),
      y: irisData[i].y
    }));
    setIrisData(res);
  }, [operationX]);

  useEffect(() => {
    const res = dataArray.map((d: any, i: number) => new Object({
      x: irisData[i].x,
      y: getWeightedPos(d, weightObj["y"], operationY)
    }));
    setIrisData(res);
  }, [operationY]);

  useDeepCompareEffect(() => {
    if (dataArray.length > 0) {
      const res = dataArray.map((d: any) => new Object({
        x: getWeightedPos(d, weightObj["x"], operationX),
        y: getWeightedPos(d, weightObj["y"], operationY)
      }));
      setIrisData(res);
    }
  }, [weightObj, dataArray]);

  const reader = new FileReader();
  const fileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const config = {
      header: true
    };

    reader.readAsText(e.target.files[0]);
    reader.onload = (_) => {
      const json = Papa.parse(reader.result as string, config);
      setCsvData(json)
    };
  }

  useDeepCompareEffect(() => {
    if (csvData.data && csvData.errors) {
      setErrors(JSON.parse(JSON.stringify(csvData.errors)));
      setCsvColumn(JSON.parse(JSON.stringify(csvData.data)));
      setCsvRows(csvData.meta.fields.map((row) => ({
        field: row,
        headerName: row,
        id: row,
        width: 50
      })));
    }
  }, [csvData]);


  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{textDecoration: "underline"}}>
          Metrics Generator
        </h1>
        <div className="container">
          <div className="column">
            <ThemeProvider theme={theme}>
              <Button
                color="primary"
                variant="contained"
                onClick={randomizeWeight}
              >
                Random
              </Button>
            </ThemeProvider>
          </div>
          <div className="column">
            <ThemeProvider theme={theme}>
              <Button
                color="primary"
                variant="contained"
                component="label"
              >
                File Upload
                <input
                  hidden
                  type="file"
                  accept=".csv"
                  className="fileUploadButton"
                  onChange={fileUploadHandler}
                />
              </Button>
            </ThemeProvider>
          </div>
        </div>
      </header>
      <main className="App-main">
        <div className="container">
          <div className="column">
            {
              errors.map((error: any) => {
                <p>{ error.message }</p>
              })
            }
          </div>
          <div className="column">
            <div className="row">
              {
                csvRows.map((row: any) => {
                  <p>{ row.fields }</p>
                })
              }
            </div>
            <div className="row">
              {
                csvColumn.map((column: any) => {
                  <p>{ column }</p>
                })
              }
              <DataGrid
                rows={csvRows}
                columns={csvColumn}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
              />
            </div>
          </div>
        </div>
        <div className="container">
          <div className="column">
            <div className="row">
              <ScatterPlot
                data={irisData}
                labels={targetValData}
              />
            </div>
          </div>
          <div className="column">
            <div className="row">
              <h5>
                Weight of X Axis
              </h5>
              <WeightForm
                data={wX}
                attributeLabelNameList={attributeLabels}
                handleWeightChange={setWX}
              />
              <OpCodeForm
                data={operationX}
                handleOpeChange={setOperationX}
              />
              <WeightVis
                data={wX}
                attributeLabelNameList={attributeLabels}
                handleWeightChange={setWX}
              />
            </div>
            <div className="row">
              <h5>
                Weight of Y Axis
              </h5>
              <WeightForm
                data={wY}
                attributeLabelNameList={attributeLabels}
                handleWeightChange={setWY}
              />
              <OpCodeForm
                data={operationY}
                handleOpeChange={setOperationY}
              />
              <WeightVis
                data={wY}
                attributeLabelNameList={attributeLabels}
                handleWeightChange={setWY}
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="App-footer">
        <h6>
          Metrics generator
        </h6>
      </footer>
    </div>
  );
}

export default App;

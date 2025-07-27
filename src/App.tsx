import React, { useState, useEffect } from 'react';
import ScatterPlot from './ScatterPlot';
import WeightForm from './WeightForm';
import WeightVis from './WeightVis';
import OpCodeForm from './OpCodeForm';
import LoadedData from './loadedData';

import { Button, Divider, ThemeProvider } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
import { createTheme } from '@mui/material/styles';
import useDeepCompareEffect from 'use-deep-compare-effect';
import Papa from 'papaparse';

import * as d3 from 'd3';

import './App.css';

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
  const [targetValColumn, setTargetValColumn] = useState<string>(attributeColumn);
  const [uploadedData, setUploadedData] = useState<Array<any>>([]);

  const [wX, setWX] = useState<Array<number>>([]);
  const [wY, setWY] = useState<Array<number>>([]);

  const [operationX, setOperationX] = useState<Array<string>>([]);
  const [operationY, setOperationY] = useState<Array<string>>([]);

  const randomizeWeight = (_: any) => {
    setWX(wX.map((_: any) => Math.random()));
    setWY(wY.map((_: any) => Math.random()));
  }

  const handleTargetValColumnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTargetValColumn(event.target.value);
  };

  // const [errors, setErrors] = useState<Array<any>>([]);
  const [csvColumns, setCsvColumns] = useState<Array<any>>([]);
  const [csvRows, setCsvRows] = useState<Array<any>>([]);

  const[weightObj, setWeightObj] = useState<any>({
    "x": wX,
    "y": wY
  });

  const dividerStyle = {
    color: "white",
    borderColor: "white",
    borderWidth: "0.5px",
    '&:before, &:after': {
      borderColor: "white",
      borderWidth: "0.5px"
    }
  }

  useEffect(() => {
    const d = d3.csv(iris_url);
    if (!d) return;

    d.then((data: any) => {
      setUploadedData(data);
    }).catch((error: any) => {
      console.log(error);
      setUploadedData([]);
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
      y: irisData[i]?.y
    }));
    setIrisData(res);
  }, [operationX]);

  useEffect(() => {
    const res = dataArray.map((d: any, i: number) => new Object({
      x: irisData[i]?.x,
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

  const fileUploadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const parseConfig = {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        setUploadedData(results.data);
        setTargetValColumn("");
      }
    };

    Papa.parse(e.target.files[0], parseConfig);
  }

  useDeepCompareEffect(() => {
    if (uploadedData.length === 0) return;

    const data: any = uploadedData;
    const columns = Object.keys(data[0]);
    const attributes = columns.filter((c: string) => c !== targetValColumn);
    const arr = data.map((d: any) => {
      return attributes.map((attr: string) => parseFloat(d[attr]));
    });

    setTargetValData(targetValColumn ? data.map((d: any) => d[targetValColumn]) : []);
    setDataArray(arr);
    setAttributeLabels(attributes);

    setWX(attributes.map((_: any) => Math.random()));
    setWY(attributes.map((_: any) => Math.random()));

    setOperationX(attributes.slice(1).map((_: any) => "+"));
    setOperationY(attributes.slice(1).map((_: any) => "+"));

    setCsvColumns([...data]);
    setCsvRows([...columns.map((row: any) => ({
      field: row,
      headerName: row,
      id: row,
      width: 50
    }))]);

  }, [uploadedData, targetValColumn]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{textDecoration: "underline"}}>
          Metrics Generator
        </h1>
        <div className="container">
          <div className="row">
            <ThemeProvider theme={theme}>
              <Button
                color="primary"
                variant="outlined"
                onClick={randomizeWeight}
              >
                Random
              </Button>
            </ThemeProvider>
          </div>
          <div className="row">
            <ThemeProvider theme={theme}>
              <Button
                color="primary"
                variant="outlined"
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
      <Divider sx={dividerStyle} textAlign="center">
          Edit Metrics    
      </Divider>
      <main className="App-main">
        <div className="container">
          <div className="column">
            <LoadedData
              errors={[]}
              csvRows={csvRows}
              csvColumns={csvColumns}
              targetValColumn={targetValColumn}
              onTargetValColumnChange={handleTargetValColumnChange}
            />
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
      <Divider sx={dividerStyle}></Divider>
      <footer className="App-footer">
        <h6>
          Metrics generator
        </h6>
      </footer>
    </div>
  );
}

export default App;

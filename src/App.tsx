import React, { useState, useEffect } from 'react';
import ScatterPlot from './ScatterPlot';
import WeightForm from './WeightForm';
import WeightVis from './WeightVis';
import OpCodeForm from './OpCodeForm';

import { Button } from '@material-ui/core';

import * as d3 from 'd3';
import './App.css';

import useDeepCompareEffect from 'use-deep-compare-effect';
// const druid: any = require('@saehrimnir/druidjs');

/*
const _generateData = (n: number, n2: number) => {
  const arr = Array(n)
  return arr.map((d, i) => {
    if (i < n2) {
      return {
        "x": d3.randomNormal(1, 100)(),
        "y": d3.randomNormal(1, 100)()
      }
    } else {
      return {
        "x": d3.randomNormal(1, 50)(),
        "y": d3.randomNormal(1, 50)()
      }
    }
  });
}
*/

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
    if (i > 0) {
      result = getOperation(result, v, operation[i - 1])
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
    setWY(wY.map((w: any) => w + Math.random()));
  }

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

      setTargetValData(data.map((d: any) => d.Species));
      setDataArray(arr);
      // setTargetValData()
      const attributes = columns.slice(0, columns.length - 1);
      setAttributeLabels(attributes)

      setWX(attributes.map((_: any) => Math.random()));
      setWY(attributes.map((_: any) => Math.random()));

      setOperationX(attributes.slice(1).map((_: any) => "+"));
      setOperationY(attributes.slice(1).map((_: any) => "+"));
    }).catch((error: any) => {
      console.log(error);
      setDataArray([]);
      return;
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

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Metrics Generator
        </p>
      </header>
      <main className="App-main">
        <div className="container">
          <div className="column">
            <div className="row">
              <Button
                color="primary"
                variant="outlined"
                onClick={randomizeWeight}
              >
                Random
              </Button>
            </div>
            <div className="row">
              <ScatterPlot
                data={irisData}
                labels={targetValData}
              />
            </div>
          </div>
          <div className="column">
            <div className="row">
              <p>
                Weight of X Axis
              </p>
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
              />
            </div>
            <div className="row">
              <p>
                Weight of Y Axis
              </p>
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
              />
            </div>
          </div>
        </div>
      </main>
      <footer className="App-footer">
        <p>
          Metrics generator
        </p>
      </footer>
    </div>
  );
}

export default App;

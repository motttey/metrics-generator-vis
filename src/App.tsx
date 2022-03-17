import React, { useState, useEffect } from 'react';
import ScatterPlot from './ScatterPlot';
import WeightForm from './WeightForm';
import WeightVis from './WeightVis';

import { Button } from '@material-ui/core';

import * as d3 from 'd3';
import './App.css';

import useDeepCompareEffect from 'use-deep-compare-effect';
// const druid: any = require('@saehrimnir/druidjs');

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

const getWeightedPos = (arr: Array<any>, wx: Array<number>, wy: Array<number>) => {
  return {
    x: d3.sum(arr.map((v: any, i: number) => v * wx[i])),
    y: d3.sum(arr.map((v: any, i: number) => v * wy[i]))
  }
}

const iris_url = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv';

function App() {
  const [dataArray, setDataArray] = useState<Array<any>>([]);
  const [irisData, setIrisData] = useState<Array<any>>([]);
  const [targetValData, setTargetValData] = useState<Array<any>>([]);
  const [attributeLabels, setAttributeLabels] = useState<Array<string>>([]);

  const [wX, setWX] = useState<Array<number>>([]);
  const [wY, setWY] = useState<Array<number>>([]);

  const randomizeWeight = (_: any) => {
    setWX(wX.map((_: any) => Math.random()));
    setWY(wY.map((w: any) => w + Math.random()));
  }

  const[weightObj, setWeightObj] = useState<any>({
    "x": wX,
    "y": wY
  });

  const handleWeightX = async (weight: Array<number>) => {
    await setWX(weight);
  }

  const handleWeightY = async (weight: Array<number>) => {
    await setWY(weight);
  }

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
    }).catch((error: any) => {
      console.log(error);
      setDataArray([]);
      return;
    });
  }, []);

  /*
  useEffect(() => {
    if (dataArray.length > 0) {
      const matrix = new druid.Matrix.from(dataArray);
      const pca = new druid.PCA(matrix, 2);
      const pca_res = pca.transform().to2dArray;
    }
  }, [dataArray]);
  */

  useEffect(() => {
    setWeightObj({
      "x": wX,
      "y": wY
    });
  }, [wX, wY]);

  useDeepCompareEffect(() => {
    if (dataArray.length > 0) {
      const res = dataArray.map((d: any) =>
        getWeightedPos(d, weightObj["x"], weightObj["y"])
      );
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
            <Button
              color="primary"
              variant="outlined"
              onClick={randomizeWeight}
            >
              Random
            </Button>
          </div>
          <div className="column">
            <ScatterPlot
              data={irisData}
              labels={targetValData}
            />
          </div>
          <div className="column">
            <WeightForm
              data={wX}
              attributeLabelNameList={attributeLabels}
              handleWeightChange={setWX}
            />
            <WeightVis
              data={wX}
              attributeLabelNameList={attributeLabels}
            />
          </div>
          <div className="column">
            <WeightForm
              data={wY}
              attributeLabelNameList={attributeLabels}
              handleWeightChange={setWY}
            />
            <WeightVis
              data={wY}
              attributeLabelNameList={attributeLabels}
            />
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

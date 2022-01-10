import React, { useState, useEffect } from 'react';
import ScatterPlot from './ScatterPlot';
import WeightVis from './WeightVis';

import * as d3 from 'd3';
import './App.css';

const druid: any = require('@saehrimnir/druidjs');

const _generateData = (n: number, n2: number) => {
  return Array.apply(null, Array(n)).map((d, i) => {
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

const getPosition = (arr: any) => {
  return {
    x: arr[0],
    y: arr[1]
  }
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
  const [wX, setWX] = useState<Array<number>>([]);
  const [wY, setWY] = useState<Array<number>>([]);

  const randomizeWeight = (e: any) => {
    setWX(wX.map((_: any) => Math.random()));
    setWY(wY.map((w: any) => w + Math.random()));
  }

  useEffect(() => {
    d3.csv(iris_url).then((data: any) => {
      const columns = data.columns;
      const arr = data.map((d: any) => {
        return Object.values(d).slice(0, 4)
          .map((v: any) => parseFloat(v));
      });

      const labels = data.map((d: any) => {
        const values = Object.values(d);
        return values[values.length - 1];
      });

      setDataArray(arr);

      setWX(columns.slice(0, 4).map((_: any) => Math.random()));
      setWY(columns.slice(0, 4).map((_: any) => Math.random()));
    }).catch((error: any) => {
      console.log(error);
      setDataArray([]);

      return;
    });
  }, []);

  useEffect(() => {
    if (dataArray.length > 0) {
      const matrix = new druid.Matrix.from(dataArray);
      const pca = new druid.PCA(matrix, 2);
      const pca_res = pca.transform().to2dArray;
      console.log(pca_res);
    }
  }, [dataArray]);

  useEffect(() => {
    if (dataArray.length > 0 && wX.length > 0 && wY.length > 0) {
      const res = dataArray.map((d: any) =>
        getWeightedPos(d, wX, wY)
      );
      setIrisData(res);
    }
  }, [wX, wY, dataArray]);

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
            <button onClick={randomizeWeight}>Random</button>
          </div>
          <div className="column">
            <ScatterPlot
              data={irisData}
            />
          </div>
          <div className="column">
            <WeightVis
              data={wX}
            />
          </div>
          <div className="column">
            <WeightVis
              data={wY}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

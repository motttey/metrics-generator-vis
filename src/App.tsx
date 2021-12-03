import React, { useState, useEffect } from 'react';
import ScatterPlot from './ScatterPlot';
import * as d3 from 'd3';
// import * as druid from '@saehrimnir/druidjs';

import './App.css';

function App() {

  const generateData = (n: number, n2: number) => {
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

  const data = generateData(1000, 500);

  const getPosition = (arr: any) => {
    return {
      x: d3.sum(arr) / arr.length,
      y: Math.random()
    }
  }

  const iris_url = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv';
  const [irisData, setIrisData] = useState([]);

  useEffect(() => {
    d3.csv(iris_url).then((data: any) => {
      const columns = data.columns;
      const dataArray = data.map((d: any) => {
        return Object.values(d).slice(0, 4)
          .map((v: any) => parseFloat(v));
      });

      const labels = data.map((d: any) => {
        const values = Object.values(d);
        return values[values.length - 1];
      });

      /*
      console.log(columns);
      console.log(dataArray);
      console.log(labels);

      const matrix = new druid.Matrix(dataArray);
      const pca = new druid.PCA(matrix, d=2);
      */
      const res = dataArray.map((d: any) => getPosition(d));
      setIrisData(res);
    });
  });

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
            <ScatterPlot
              data={irisData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import ScatterPlot from './ScatterPlot';
import * as d3 from 'd3';

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
              data={data}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

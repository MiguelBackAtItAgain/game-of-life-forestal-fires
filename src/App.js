import React, {useCallback, useState, useRef} from "react";
import produce from 'immer';

const numRows = 50;
const numCols = 50;

const operations = [
  [0, 1],
  [0,-1],
  [1,-1],
  [-1,1],
  [1,1],
  [-1,-1],
  [1,0],
  [-1, 0]
];

const App : React.FC = () => {
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i<numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;

  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef();
  runningRef.current = running;

  const RunSimulation = useCallback(() => {
    if(!runningRef.current) {
      return;
  }

  setGrid((g) => {
    return produce(g, gridCopy => {
      for(let i=0; i<numRows; i++){
          for(let k=0; k<numCols; k++){
            let neighbours = 0;
            operations.forEach(([x,y]) => {
              const newI = i+x;
              const newK = k+y;
              if(newI >= 0 && newI < numRows && newK >= 0 && newK < numCols){
                neighbours += g[newI][newK];
              }
          });

          if(neighbours < 2 || neighbours > 3) {
            gridCopy[i][k] = 0;
          } else if(g[i][k] === 0 && neighbours === 3) {
            gridCopy[i][k] = 1;
          }
        }
      }
    });
  });

  setTimeout(RunSimulation, 1000);
  }, []);


  return (
    <>
    <h1>Forestal fire simulation (based on game of life)</h1>
    <p></p>
    <p>You've forgotten a couple of plastic and glass bottles in the forest, now a fire has started!</p>
    <p>The only thing you can do is try to remember where you left the bottles and help the fire department.</p>
    <p>Click on the spots where you though you left the bottles and press start to view a simulation of how the fire spreads!</p>
    <p>Maybe next time you won't forget the bottles and take them home with you to either recicle or dispose them properly .___________.</p>
    <p>Some of the suggested patterns are the following (remember you can also mix them up and try whatever you want): </p>
    <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Game_of_life_toad.gif"></img>
    <p></p>
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Animated_Mwss.gif"></img>
    <p></p>
    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Animated_Hwss.gif"></img>
    <p></p>
    <p>When you're ready, press start</p>
      <button
        onClick={() => {
          setRunning(!running);
          if(!running) {
          runningRef.current = true;
          RunSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <p></p>
      <div style={{
        display: 'grid',
        backgroundColor: 'green',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}>
        {grid.map((rows, i) =>
          rows.map((col,k) => (
            <div
            key={`$(i)-$(k)`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][k] = grid[i][k] ? 0 : 1;
              })
              setGrid(newGrid);

            }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? 'yellow' : undefined,
                border: "solid 1px black"
              }} 
            />
          ))
        )}
      </div>
    </>
    );
  };



export default App;

import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div></div>
      <h1>Simple electron template</h1>
      <h2>Esbuild + React + Typescript</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>0 dependencies, easy to use and maintain.</p>
      </div>
    </>
  );
}

export default App;

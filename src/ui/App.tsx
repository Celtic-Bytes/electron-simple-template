import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Simple electron template</h1>
      <h2>Esbuild + React + Typescript</h2>
      <div className='card'>
        <p className='card__count'>Count: {count}</p>
        <div className='card__controls'>
          <button
            type='button'
            className='card__button'
            aria-label='Decrement'
            onClick={() => setCount((c) => c - 1)}
          >
            −
          </button>
          <button
            type='button'
            className='card__button'
            aria-label='Increment'
            onClick={() => setCount((c) => c + 1)}
          >
            +
          </button>
        </div>
        <p>0 dependencies, easy to use and maintain.</p>
      </div>
    </>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Use the typed API exposed by the preload script (window.api).
window.api.system.onMainProcessMessage((message) => {
  console.log(message);
});

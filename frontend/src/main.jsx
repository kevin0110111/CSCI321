import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

(function () {
  const _set = localStorage.setItem;
  const _get = localStorage.getItem;
  const _rem = localStorage.removeItem;
  const _clr = localStorage.clear;

  localStorage.setItem = function (k, v) {
    if (k === 'accountId') {
      console.log('[LS setItem] accountId =>', JSON.stringify(v));
      console.trace();
    }
    return _set.apply(this, arguments);
  };

  localStorage.getItem = function (k) {
    const val = _get.apply(this, arguments);
    if (k === 'accountId') {
      console.log('[LS getItem] accountId ->', JSON.stringify(val));
    }
    return val;
  };

  localStorage.removeItem = function (k) {
    if (k === 'accountId') {
      console.log('[LS removeItem] accountId');
      console.trace();
    }
    return _rem.apply(this, arguments);
  };

  localStorage.clear = function () {
    console.log('[LS clear] ALL KEYS CLEARED');
    console.trace();
    return _clr.apply(this, arguments);
  };
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

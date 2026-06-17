import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { StoreProvider } from './store.jsx'
import { CloudProvider } from './cloud.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <StoreProvider>
        <CloudProvider>
          <App />
        </CloudProvider>
      </StoreProvider>
    </HashRouter>
  </React.StrictMode>
)

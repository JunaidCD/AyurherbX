import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initBlockchain } from './utils/blockchain.js'

// Initialize blockchain utilities to prevent MetaMask errors
initBlockchain();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

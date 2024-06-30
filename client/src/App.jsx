import React from 'react'
import Router from './Routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <>
    <Router/>
    <ToastContainer position="bottom-right" />
    </>
  )
}

export default App
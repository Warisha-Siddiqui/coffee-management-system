import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';
import Employee from './components/Employee.jsx';
import Product from './components/Product.jsx';

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/employee",
    element: <Employee />
  },
  {
    path: "/product",
    element: <Product />
  },
])

function App() {
  return (
    <>
      <RouterProvider router={browserRouter} /></>
  );
}

export default App;

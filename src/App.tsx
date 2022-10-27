import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Navbar from './components/Navbar';
import './App.css';

import Home from './routes/home/Home';
import About from './routes/about/About';
import Edit from './routes/edit/Edit';
import Recent from './routes/recent/Recent';


function App() {

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/">
      <Route index element={<> <Navbar /> <Home /> </>} />
      <Route path="about" element={<> <Navbar /> <About /> </>} />
      <Route path="edit" element={<> <Navbar /> <Edit /> </>}/>
      <Route path="recent" element={<> <Navbar /><Recent /> </>}/>
    </Route>
  ))
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
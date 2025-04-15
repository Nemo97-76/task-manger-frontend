import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Login from './components/Login';
import Signup from "./components/Signup";
import Tasks from "./components/Tasks";
import './App.css';
import { NavLink } from 'react-router-dom';
import Button from '@mui/joy/Button';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
const App=()=>{
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
}


  return(
    <Router>
<div className='app-container'>
<h1 className='montserrat-header'>Task Manger</h1>

<nav className='navbar'>
<ul>
  <li className='winky-snas-list-item'>
    <NavLink to="/" className="nav-link">
      tasks
    </NavLink>
  </li>

   <li className="winky-snas-list-item">
    <NavLink to="/signup" className="nav-link">
      signup
      </NavLink>
   </li>

   <li className="winky-snas-list-item">
    <NavLink to="/login" className="nav-link">
      login
    </NavLink>
   </li>
   <Button onClick={handleLogout} endDecorator={<LogoutRoundedIcon/>}>Logout</Button>          
   </ul>
</nav>

<Routes className="content">
<Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Tasks />} />
</Routes>
</div>
    </Router>
  )
}



export default App;
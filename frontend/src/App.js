import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/Users/UsersList'
import Home from './components/Common/Home'
import Register from './components/Common/Register'
import Navbar from './components/templates/Navbar'
import Profile from './components/Applicant/Profile'
import RecProfile from  './components/Recruiter/Profile'
import Login from './components/Common/Login'
import Job_Details from "./components/Recruiter/Job_Details";

function App() {
  const navelements=[
    {
      link:"/register",
      title:"Register"
    },
    {
      link:"/login",
      title:"Login"
    }
  ]
  return (
    <Router>
      <div className="container">
        <Navbar elements={navelements}/>
        <br/>
        <Route path="/" exact component={Home}/>
        <Route path="/users" exact component={UsersList}/>
        <Route path="/register" component={Register}/>
        <Route path="/login" component={Login}/>
        <Route path="/profile" component={Profile}/>
        <Route path="/recruiter/profile" component={RecProfile}/>
        <Route path="/recruiter/job" component={Job_Details}/>
      </div>
    </Router>
  );
}

export default App;

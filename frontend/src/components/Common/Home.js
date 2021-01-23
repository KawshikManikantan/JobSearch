import React, {Component} from 'react';
import axios from 'axios';
import Navbar from "../templates/Navbar";

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

export default class Home extends Component {

    render() {
        return (
            <div>
                <Navbar elements={navelements}/>
                <h1> Welcome to the Job Search Platform</h1>
           </div>
        )
    }
}

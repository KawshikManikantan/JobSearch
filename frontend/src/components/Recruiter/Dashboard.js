import React, {Component, useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Navbar from "../templates/Navbar";
import check_auth from "../Common/authentication";
import axios from "axios";
import Cookies from "js-cookie";
import Card from '../templates/Card'
import {Container} from "@material-ui/core";

function Rec_Dash() {
    const [details, setDetails] = useState([]);
    const [reload,setReload]=useState(false)
    const navelementsrecr=[
        {
            link:"/rec/dashboard",
            title:"DashBoard"
        },
        {
            link:"/rec/edit",
            title:"Edit"
        }
    ]
    useEffect(() => {
        // check_auth(props,'recruiter')
        const loadData= async () =>{
            try {
                console.log("didmount")
                const res = await axios.post('http://localhost:4000/job/me', {'userid':Cookies.get('userid')})
                console.log(JSON.stringify(res))
                console.log(res.data._id)
                setDetails(res.data)
            }catch(err){
                console.log(err)
            }
        }
        loadData().then()
    }, [reload]);

    const handleReload =() =>{
        setReload((prevState => {
            return(!prevState)
        }))
        console.log(reload)
    }
    const displaycards= ()=> {
        return(
            details.map((detail)=>{
                return(<Card job={detail} call={handleReload}/>)
            })
        )
    }
    return (
        <Container>
            <Navbar elements={navelementsrecr}/>
            <br/>
            <div class={"row md-3"}>
                {displaycards()}
            </div>
        </Container>
    );
}

export default Rec_Dash;

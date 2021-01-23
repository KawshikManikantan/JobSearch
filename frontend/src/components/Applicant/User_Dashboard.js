import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import Navbar from "../templates/Navbar";
import Cookies from "js-cookie";

function User_Dash(props) {
    const [userdetails,setDetails]=useState('{}')

    const navelements=[

        {
            link:{
                pathname:"/user/edit",
                state:userdetails
            },
            title:"Edit"
        },

        {
            link:{
                pathname:"/user/jobs",
                // state:userdetails
            },
            title:"Jobs"
        },

        {
            link:{
                pathname:"/user/applications",
                // state:userdetails
            },
            title:"Applications"
        },

        {
            link:{
                pathname:"/user/logout"
            },
                title:"LogOut"
        }
]
    useEffect(() => {
        const loadData= async () =>{
            try {
                console.log("didmount")
                const res = await axios.post('http://localhost:4000/profile/applicant/me', {'userid':Cookies.get('userid')})
                console.log(JSON.stringify(res))
                console.log(res.data._id)
                setDetails(res.data)
            }catch(err){
                console.log(err)
            }
        }
        loadData().then()
    }, []);

    return (
        <div>
            <Navbar elements={navelements}/>
            <h1> Welcome {userdetails.name}</h1>
        </div>
    )

}

export default User_Dash

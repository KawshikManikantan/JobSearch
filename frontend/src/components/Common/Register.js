import React, {Component, useState} from 'react';
import axios from 'axios';
import {useForm} from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import Cookies from 'js-cookie'
import Navbar from "../templates/Navbar";


//Navigation Elements
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


//Yup Schema for validation
const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
    type:yup.string().required()
});

const Registration = (props) => {

    //Registering the schema
    const { register, handleSubmit, errors } = useForm({
        resolver: yupResolver(schema),
        reValidateMode:"onSubmit"
    });

    //State definition using Hooks
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');


    //Function to Implement on Submitting
    const onSubmit = async event => {
        try {

            const newUser = {
                email: email,
                password: password,
                type: type
            }
            console.log(newUser)

            //Resetting state after submission
            setEmail('');
            setPassword('');
            setType('');

            const res = await axios.post('http://localhost:4000/auth/register', newUser)
            Cookies.set('id', res.data.id)
            Cookies.set('userid', res.data.userid)
            Cookies.set('type', res.data.type)
            Cookies.set('prof_built', res.data.prof_built)

            if (res.data.type === 'applicant') {
                props.history.push('/profile')
            }

            if (res.data.type === 'recruiter') {
                props.history.push('/recruiter/profile')
            }
        }catch(err){
            alert(err)

        }
        // props.history.push("/");
    }
    return (
        <div>
            <Navbar elements={navelements}/>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Email: </label>
                    <input type="text"
                           name="email"
                           placeholder="Email"
                           ref={register}
                           className="form-control"
                           value={email}
                           onChange={event =>setEmail(event.target.value)}/>
                    <p style={{ color:"red" }}>{errors.email?.message}</p>
                </div>
                <div className="form-group">
                    <label>Password (Minimum of 8 letters): </label>
                    <input type="password"
                           name="password"
                           placeholder="Password"
                           className="form-control"
                           value={password}
                           onChange={event => {
                               setPassword(event.target.value)
                           }}
                           ref={register}
                    />
                    <p style={{ color:"red" }}>{errors.password?.message}</p>
                </div>
                <div className="form-group">
                    <input name="type" type="radio" value="applicant" ref={register} onChange={event => setType(event.target.value)}/>
                    <label>I am looking for Job Opportunities</label>
                    <br/>
                    <input name="type" type="radio" value="recruiter" ref={register} onChange={event => setType(event.target.value)}/>
                    <label>I am looking to Recruit </label>
                    <p style={{ color:"red" }}>{errors.type?.message}</p>
                    <br/>
                    {/*<input type="radio" id="male" name="gender" value="male"/>*/}
                    {/*<label htmlFor="male">Male</label>*/}
                    {/*<br/>*/}
                    {/*<input type="radio" id="female" name="gender" value="female"/>*/}
                    {/*<label htmlFor="female">Female</label>*/}
                </div>
                <div className="form-group">
                    <input type="submit" value="Register" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}
export default Registration

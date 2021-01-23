import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {TextareaAutosize} from "@material-ui/core";
import Cookies from 'js-cookie';
import check_auth from "../Common/authentication";

const schema = yup.object().shape({
    sop:yup.string().max(250).required()
});

const User_SOP = (props) => {

    const {register, handleSubmit, errors} = useForm({
        reValidateMode:'onSubmit',
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    useEffect(() => {
        // check_auth(props,'recruiter')
    }, []);

    const[application,setApplication]=useState({
        ...props.location.state,
        sop:''
    })

    const onSubmit = async event => {
        try {
            // console.log(application)
            const res = await axios.post('http://localhost:4000/appl/user/create', application)
            props.history.push('/user/dash')
            console.log(res)
            return false
        }catch(err){
            console.log(err)
        }
    }
    return (

        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>SOP: </label>
                    <TextareaAutosize
                        name="sop"
                        aria-label="empty textarea"
                        className="form-control"
                        placeholder="Sop"
                        value={application.sop}
                        onChange={(event) => {
                            event.persist()
                            setApplication((prevState => {
                           return(
                               {
                                   ...prevState,
                                   sop:event.target.value
                               }
                           )
                        }))}}
                        ref={register}
                    />
                    <p style={{ color:"red" }}>{errors.sop?.message}</p>
                </div>
                <div className="form-group">
                    <input type="submit" value="Apply" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}

export default User_SOP

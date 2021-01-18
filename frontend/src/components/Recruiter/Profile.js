import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {TextareaAutosize} from "@material-ui/core";
import Cookies from 'js-cookie';
import check_auth from "../Common/authentication";


const schema = yup.object().shape({
    name:yup.string().required(),
    contact:yup.number().integer().positive().max(9999999999).required(),
    bio:yup.string().max(250).required()
});


const Profile_Recruiter = (props) => {

    useEffect(() => {
        check_auth(props,'recruiter')
    }, []);
    
    const {register, handleSubmit, errors} = useForm({
        reValidateMode:'onSubmit',
        mode: 'onSubmit',
        resolver: yupResolver(schema)
    });

    const email=Cookies.get('userid')



    const [name, setName] = useState('');
    const [contact,setContact]=useState('');
    const [bio,setBio]=useState('')

    const onSubmit = async event => {
        const details={
            'name':name,
            'email':email,
            'contact':contact,
            'bio':bio
        }
        try {
            const res = await axios.post('http://localhost:4000/profile/recruiter', details)
            console.log(res)
            setName('')
            setContact('')
            setBio('')
            return false
        }catch(err){
            console.log(err)
        }
    }

    // function handleRemove(i) {
    //     setDetails({...details,"education": details.education.splice(i,1)});
    // }



    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Email: </label>
                    <input type="text"
                           name="email"
                           placeholder="email"
                           value={email}
                           className="form-control"
                           readOnly={true}/>
                </div>
                <div className="form-group">
                    <label>Name: </label>
                    <input type="text"
                           name="name"
                           className="form-control"
                           placeholder="Name"
                           value={name}
                           onChange={event => setName(event.target.value)}
                           ref={register}
                    />
                    <p style={{ color:"red" }}>{errors.name?.message}</p>
                </div>

                <div className="form-group">
                    <label>Contact: </label>
                    <input type="text"
                           name="contact"
                           placeholder="Contact Number"
                           className="form-control"
                           value={contact}
                           onChange={event => setContact(event.target.value)}
                           ref={register}
                    />
                    <p style={{ color:"red" }}>{errors.contact?.message}</p>
                </div>

                <div className="form-group">
                    <label>Bio: </label>
                    <TextareaAutosize
                        name="bio"
                        aria-label="empty textarea"
                        className="form-control"
                        placeholder="Bio"
                        value={bio}
                        onChange={event => setBio(event.target.value)}
                        ref={register}
                    />
                    <p style={{ color:"red" }}>{errors.bio?.message}</p>
                </div>

                <div className="form-group">
                    <input type="submit" value="Register" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}
export default Profile_Recruiter

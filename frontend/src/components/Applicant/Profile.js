import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {Col, Form} from "react-bootstrap";
import {Chip, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Autocomplete} from "@material-ui/lab";
import Cookies from 'js-cookie'
import check_auth from "../Common/authentication";
;

const schema = yup.object().shape({
    name:yup.string().required(),
    institute:yup.string().required(),
    start:yup.number().integer().min(1950).max((new Date()).getFullYear()).required(),
    end:yup.number().integer().positive().min(1950).max((new Date()).getFullYear()),
    // skills:yup.array().min(1)
});

class AddIcon extends Component {
    render() {
        return null;
    }
}

const Profile_Applicant = (props) => {

    useEffect(() => {
        check_auth(props,'applicant')
    }, []);

    const {register, handleSubmit, errors} = useForm({
        reValidateMode:"onSubmit",
        resolver: yupResolver(schema)
    });

    const initial = {
        'name': '',
        'email': Cookies.get('userid'),
        'education': [
            {
                "institute": '',
                "start": '',
                "end":''
            }
        ],
        'skills': ['C', 'C++']
    }
    const [details, setDetails] = useState(initial);

    const onSubmit = async event => {
        // console.log(details)
        try {
            const res = await axios.post('http://localhost:4000/profile/applicant', details)
            console.log(res)
            setDetails(initial);
            // props.history.push('/dashboard')

            return false
        }catch(err)
        {
            console.log(err)
        }
    }

    // function handleRemove(i) {
    //     setDetails({...details,"education": details.education.splice(i,1)});
    // }

    const handleChange = (property,event) =>{
        setDetails({ ...details, [property]: event.target.value })
    }

    const handleRemove = (idx) => {
        setDetails(prevState => {
            const neweducation=prevState.education
            neweducation.splice(idx,1)
            return ({
                ...prevState,
                "education": neweducation
            })
        })
    }

    const handleSkillChange = values =>  {
        setDetails(prevState => {
            return ({
                ...prevState,
                "skills": values
            })
        })
        console.log(details)
    };

    const handleAdd = () => {

        setDetails(prevState => {
            const neweducation=prevState.education
            neweducation.push({
                "institute": '',
                "start": '',
                "end": ''
            })
            return ({
                ...prevState,
                "education": neweducation
            })
        })
    }

    const handleEducationChange = (idx,property,value) =>{
        setDetails(prevState => {
            const neweducation=prevState.education
            neweducation[idx]={
                ...neweducation[idx],
                [property]: value
            }
            // console.log(neweducation)
            return({
                ...prevState,
                "education": neweducation
            })
        })
        console.log(details.education)
    }

    // cosnt handleSkillChange= ()
    const skills=["C","C++","Python","Ruby","Java","Javascript","React","Node","Julia"]

    const education= details.education.map((inst,idx) => {
        return (
            <div key={idx}>
            <Form.Row >
                <Col xs={7}>
                    <Form.Control
                        name="institute"
                        placeholder="Institution"
                        value={details.education[idx].institute}
                        onChange={event => handleEducationChange(idx,"institute", event.target.value)}
                    ref={register}
                        />
                    <p style={{ color:"red" }}>{errors.institute?.message}</p>
                </Col>
                <Col>
                    <Form.Control
                        name="start"
                        placeholder="Begin"
                        value={details.education[idx].start}
                        onChange={event => handleEducationChange(idx,"start", event.target.value)}
                        ref={register}
                    />
                    <p style={{ color:"red" }}>{errors.start?.message}</p>
                </Col>
                <Col>
                    <Form.Control
                        name="end"
                        placeholder="End"
                        value={details.education[idx].end}
                        onChange={event => handleEducationChange(idx,"end", event.target.value)}
                        ref={register}
                    />
                    <p style={{ color:"red" }}>{errors.end?.message}</p>
                </Col>
                <button type="button" className="close" aria-label="Close" onClick={event => {
                    handleRemove(idx)
                }}>
                    <span aria-hidden="true">&times;</span>
                </button>
                <br/>
                <br/>
            </Form.Row>
            </div>
        )
    })

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Email: </label>
                    <input type="text"
                           name="email"
                           value={details.email}
                           placeholder="email"
                           className="form-control"
                           readOnly={true}/>
                </div>
                <div className="form-group">
                    <label>Name: </label>
                    <input type="text"
                           name="name"
                           className="form-control"
                           value={details.name}
                           onChange={event => handleChange("name",event)}
                           ref={register}
                    />
                    <p style={{ color:"red" }}>{errors.name?.message}</p>
                </div>
                <div className="form-group">
                    <Col className="p-0">
                        <label>Education Details (Press the add button to add more fields) :</label>
                        <Button className="ml-5" variant="contained" color="primary" component="span" onClick={event=>{handleAdd()}}>
                            Add
                        </Button>
                    </Col>
                </div>
                <div className="form-group">
                    {education}
                </div>
                <div className="form-group">
                    <label>Add your skills ( Press Enter to Add If Not Available): </label>
                    <Autocomplete
                        multiple
                        id="tags-filled"
                        name="skills"
                        options={skills}
                        values={details.skills}
                        defaultValue={[skills[0],skills[1]]}
                        onChange={ (event, values) => handleSkillChange(values) }
                        freeSolo
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option}  {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Skills" placeholder="Skills" />
                        )}
                        // ref={register}
                    />
                    {/*<p style={{ color:"red" }}>{errors.skills?.message}</p>*/}
                </div>
                <div className="form-group">
                    <input type="submit" value="Register" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}
export default Profile_Applicant

import React, {Component, useEffect, useState} from 'react';
import axios from 'axios';
import {useForm} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import {Col, Form} from "react-bootstrap";
import {Chip, FormControl, NativeSelect, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Autocomplete} from "@material-ui/lab";
import Cookies from 'js-cookie'
import check_auth from "../Common/authentication";
import moment from 'moment';
import {classes} from "istanbul-lib-coverage";

const schema = yup.object().shape({
    // name:yup.string().required(),
    // institute:yup.string().required(),
    // start:yup.number().integer().min(1950).max((new Date()).getFullYear()).required(),
    // end:yup.number().integer().positive().min(1950).max((new Date()).getFullYear()),
    // // skills:yup.array().min(1)
});

// class AddIcon extends Component {
//     render() {
//         return null;
//     }
// }

const Job_Details = (props) => {

    // useEffect(() => {
    //     check_auth(props,'applicant')
    // }, []);

    const {register, handleSubmit, errors} = useForm({
        reValidateMode:"onSubmit",
        resolver: yupResolver(schema)
    });

    const initial = {
        'title': '',
        'max_applications': '',
        'max_positions':'',
        'date_posting':moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        'deadline':'',
        'skills': ['C', 'C++'],
        'type':'',
        'duration':'',
        'salary':'',
        'recruiter':Cookies.get('id')
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
        } catch(err)
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
    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>Title: </label>
                    <input type="text"
                           name="title"
                           value={details.title}
                           placeholder="email"
                           onChange={event => handleChange("title",event)}
                           className="form-control"
                           />
                </div>
                <br/>
                <Form.Row>
                    <Col>
                        <div className="form-group">
                            <label>Maximum Number of Applications: </label>
                            <input type="text"
                                   name="max_applications"
                                   className="form-control"
                                   value={details.max_applications}
                                   onChange={event => handleChange("max_applications",event)}
                                   ref={register}
                            />
                            <p style={{ color:"red" }}>{errors.name?.message}</p>
                        </div>
                    </Col>
                    <Col>
                        <div className="form-group">
                            <label>Maximum Number of Positions: </label>
                            <input type="text"
                                   name="max_positions"
                                   className="form-control"
                                   value={details.max_positions}
                                   onChange={event => handleChange("max_positions",event)}
                                   ref={register}
                            />
                            <p style={{ color:"red" }}>{errors.name?.message}</p>
                        </div>
                    </Col>
                    <Col>
                        <div className="form-group">
                            <label>Deadline For Appilcation: </label>
                            <input type="datetime-local"
                                   min={new Date()}
                                   name="deadline"
                                   className="form-control"
                                   value={details.deadline}
                                   onChange={event => handleChange("deadline",event)}
                                   ref={register}
                            />
                            <p style={{ color:"red" }}>{errors.name?.message}</p>
                        </div>
                    </Col>
                </Form.Row>
                <br/>
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
                <br/>
                <Form.Row>
                    <Col>
                        <div className="form-group">
                            <label>Duration of Job </label>
                            <br/>
                            <FormControl className="form-control">
                                <NativeSelect
                                    value={details.duration}
                                    onChange={event => handleChange("duration",event)}
                                    name="type"
                                    className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'type' }}
                                >
                                    <option value="">None</option>
                                    <option value={0}>Indefinite</option>
                                    <option value={1}>1 month</option>
                                    <option value={2}>2 months</option>
                                    <option value={3}>3 months</option>
                                    <option value={4}>4 months</option>
                                    <option value={5}>5 months</option>
                                    <option value={6}>6 months</option>
                                </NativeSelect>
                            </FormControl>
                        </div>
                    </Col>
                    <Col>
                        <label>Type of Job Profile:</label>
                        <br/>
                        <FormControl className="form-control">
                            <NativeSelect
                                value={details.type}
                                onChange={event => handleChange("type",event)}
                                name="type"
                                className={classes.selectEmpty}
                                inputProps={{ 'aria-label': 'type' }}
                            >
                                <option value="">None</option>
                                <option value="fulltime">Full-Time</option>
                                <option value="parttime">Part-Time</option>
                                <option value="wfh">Work From Home</option>
                            </NativeSelect>
                        </FormControl>
                    </Col>
                    <Col>
                        <div className="form-group">
                            <label>Salary per month: </label>
                            <input type="text"
                                   name="salary"
                                   className="form-control"
                                   value={details.salary}
                                   onChange={event => handleChange("salary",event)}
                                   ref={register}
                            />
                            <p style={{ color:"red" }}>{errors.name?.message}</p>
                        </div>
                    </Col>
                </Form.Row>
                <div className="form-group">
                    <input type="submit" value="Register" className="btn btn-primary"/>
                </div>
            </form>
        </div>
    )
}
export default Job_Details

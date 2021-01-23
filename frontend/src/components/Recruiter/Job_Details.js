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
    title:yup.string().required(),
    max_positions:yup.number().required(),
    max_applications:yup.number().required()
                        .moreThan(
                        yup.ref('max_positions'),
                        'Should be more than max_positions'),
    deadline:yup.date().required(),
    // type:yup.string().required(),
    // duration:yup.string().required(),
    salary:yup.number().required(),
    skills:yup.array().min(1)
});

// class AddIcon extends Component {
//     render() {
//         return null;
//     }
// }

const Job_Details = (props) => {
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
        'type':'fulltime',
        'duration':'0',
        'salary':'',
        'recruiter':''
    }
    const [details, setDetails] = useState(props.location.state|| initial);
    console.log(moment(details.deadline).format("YYYY-MM-DDTHH:mm:ss"))
    useEffect(() => {
        // check_auth(props,'applicant')
        const loadData= async () =>{
            try {
                console.log("didmount")
                const res = await axios.post('http://localhost:4000/profile/recruiter/me', {'userid':Cookies.get('userid')})
                console.log(JSON.stringify(res))
                console.log(res.data._id)
                setDetails((prevState => { return({...prevState, "recruiter": res.data._id })}))
            }catch(err){
                console.log(err)
            }
        }
        loadData()
    }, []);
    const onSubmit = async event => {
        // console.log(details)
        try {
            // const checkfinal=await schema
            //     .isValid({
            //         type: details.type,
            //         duration: details.duration,
            //     })
            if(typeof props.location.state !=='undefined')
            {
                let res = await axios.put('http://localhost:4000/job/create', details)
                console.log(res)
            }
            else{
                let res = await axios.post('http://localhost:4000/job/create', details)
                console.log(res)
            }

            props.history.push('/recruiter/dash')
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
        event.persist()
        console.log(details)
        setDetails((prevState => { return({...prevState, [property]: event.target.value })}))
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
                           placeholder="Title"
                           onChange={event => handleChange("title",event)}
                           className="form-control"
                           ref={register}
                           readOnly={(typeof props.location.state !== 'undefined')}
                           />
                    <p style={{ color:"red" }}>{errors.title?.message}</p>
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
                            <p style={{ color:"red" }}>{errors.max_applications?.message}</p>
                        </div>
                    </Col>
                    <Col>
                        <div className="form-group">
                            <label>Maximum Number of Positions: </label>
                            <input type="text"
                                   name="max_positions"
                                   className="form-control"
                                   value={details.max_positions}
                                   onChange={event => { console.log(details);handleChange("max_positions",event)}}
                                   ref={register}
                            />
                            <p style={{ color:"red" }}>{errors.max_positions?.message}</p>
                        </div>
                    </Col>
                    <Col>
                        <div className="form-group">
                            <label>Deadline For Appilcation: </label>
                            <input type="datetime-local"
                                   min={moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}
                                   name="deadline"
                                   className="form-control"
                                   value={moment(details.deadline).format("YYYY-MM-DDTHH:mm:ss")}
                                   onChange={event => handleChange("deadline",event)}
                                   // ref={register}
                            />

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
                        disabled={(typeof props.location.state !== 'undefined')}
                        // readOnly={true}
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
                                    // className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'type' }}
                                    disabled={(typeof props.location.state  !== 'undefined')}
                                    // ref={register}
                                >
                                    <option value={0}>Indefinite</option>
                                    <option value={1}>1 month</option>
                                    <option value={2}>2 months</option>
                                    <option value={3}>3 months</option>
                                    <option value={4}>4 months</option>
                                    <option value={5}>5 months</option>
                                    <option value={6}>6 months</option>
                                </NativeSelect>
                            </FormControl>
                            <p style={{ color:"red" }}>{errors.duration?.message}</p>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <label>Type of Job Profile:</label>
                            <br/>
                            <FormControl className="form-control">
                                <NativeSelect
                                    value={details.type}
                                    onChange={event => handleChange("type",event)}
                                    name="type"
                                    // className={classes.selectEmpty}
                                    inputProps={{ 'aria-label': 'type' }}
                                    disabled={(typeof props.location.state !== 'undefined')}
                                    // ref={register}
                                >
                                    {/*<option value="">None</option>*/}
                                    <option value="fulltime">Full-Time</option>
                                    <option value="parttime">Part-Time</option>
                                    <option value="wfh">Work From Home</option>
                                </NativeSelect>
                            </FormControl>
                            <p style={{ color:"red" }}>{errors.type?.message}</p>
                        </div>
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
                                   readOnly={(typeof props.location.state  !== 'undefined')}
                            />
                            <p style={{ color:"red" }}>{errors.salary?.message}</p>
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

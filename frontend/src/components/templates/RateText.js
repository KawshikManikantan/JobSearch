import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {classes} from "istanbul-lib-coverage";
import {Col, Row} from "react-bootstrap";

export default class RateText extends Component {

    constructor(props) {
        super(props);
        this.submitRating=this.submitRating.bind(this)
        this.state={rating:''}
    }

    async submitRating()
    {
        try{
            if(this.props.type==='Recruiter')
            {
                const res=await axios.post('http://localhost:4000/rate/applicant/new', {'recruiter':this.props.application.job.recruiter,'rating':this.state.rating,'applicant':this.props.application.applicant._id})
            }
            else{
                const res=await axios.post('http://localhost:4000/rate/jobs/new', {'job':this.props.application.job._id,'rating':this.state.rating,'applicant':this.props.application.applicant._id})
            }
            window.location.reload();
        }catch(err){
            console.log(err)
        }

    }
    render() {
        if(this.props.application.rating_details==='None')
        {
            return(
                <Row>
                    <Col>
                        <TextField
                            id="standard-basic"
                            label="Rate"
                            value={this.state.rating}
                            onChange={(event)=>this.setState({rating:event.target.value})}
                        />
                    </Col>
                    <Col>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.submitRating}                        >
                            Rate
                        </Button>
                    </Col>

                </Row>
            )
        }
        else
        {
            return(<div>Rated: {this.props.application.rating_details.rating}</div>)
        }
    }
}

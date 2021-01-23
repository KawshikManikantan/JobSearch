import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";

export default class Card extends Component {

    constructor(props) {
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete = async () =>{
        console.log(this.props.job._id)
        const res=await axios.post('http://localhost:4000/job/delete', {'job_id':this.props.job._id })
        this.props.call()
    }
    render() {

        return (
            <div className="card mr-3 md-3" style={{width: '24rem'}}>
                <div className="card-body">
                    <h5 className="card-title"><Link className={"card-link"} to={{
                        pathname: '/recruiter/applicants',
                        state: this.props.job
                    }}>{this.props.job.title}</Link></h5>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Date of Posting:{moment(this.props.job.date_posting).format("YYYY-MM-DDTHH:mm:ss")}</li>
                    <li className="list-group-item">Number of Applicants:{this.props.job.num_applicants}</li>
                    <li className="list-group-item">Positions Left:{this.props.job.max_positions-this.props.job.num_selected}</li>
                </ul>
                <div className="card-body">
                    <Link className={"card-link"} to={{
                        pathname: '/recruiter/job',
                        state: this.props.job
                    }}>Edit</Link>

                    <a href="#" onClick={this.handleDelete} className="card-link">Delete</a>
                </div>
            </div>
        )
    }
}

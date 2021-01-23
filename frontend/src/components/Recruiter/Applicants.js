import React, {Component} from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

import SearchIcon from "@material-ui/icons/Search";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import RemoveIcon from '@material-ui/icons/Remove';
import Cookies from "js-cookie";
import {Col, Row} from "react-bootstrap";
import moment from "moment";
import Fuse from "fuse.js";
import * as PropTypes from "prop-types";
import {FormControl, Icon, InputLabel, MenuItem, Select} from "@material-ui/core";
import {classes} from "istanbul-lib-coverage";


class ClearIcon extends Component {
    render() {
        return null;
    }
}

ClearIcon.propTypes = {onClick: PropTypes.func};

class DeleteIcon extends Component {
    render() {
        return null;
    }
}

class Rec_Applicants extends Component {

    constructor(props) {
        super(props);
        this.state = {applications: [],expandstate:[],sortby:['name','date_accept','rating'],sortstate:[2,2,2],renderapplications:[],oncl:true};
        this.initial=[true,false,false]

        // console.log(this.fuse.search("Ma"))
        this.renderIcon = this.renderIcon.bind(this);
        this.sortChange = this.sortChange.bind(this);
        this.handleClick=this.handleClick.bind(this);
        this.buttonDisplay=this.buttonDisplay.bind(this);
        this.onApplyClick=this.onApplyClick.bind(this);
        this.handleMod=this.handleMod.bind(this);
        this.loadData=this.loadData.bind(this)
    }

    async handleMod(value,ind){
        try {
            console.log(this.state.renderapplications[ind].applicant.name)
            if(value==='Accepted')
            {
                const tosend={
                    id:this.state.renderapplications[ind]._id,
                    job:this.state.renderapplications[ind].job._id,
                    applicant:this.state.renderapplications[ind].applicant._id,
                    date:Date.now,
                    sop:this.state.renderapplications[ind].sop,
                    status:value
                }
                console.log(tosend)
                const res = await axios.put('http://localhost:4000/appl/user/create', tosend)
                if(typeof res.data.message !== 'undefined')
                {
                    alert('Maximum posts filled up.Others rejected')
                    this.props.history.push('/recruiter/dash')
                }
                const newoncl=!(this.state.oncl)
                this.setState((prevState)=>{
                    return( {
                        ...prevState,
                        oncl:newoncl
                    })
                })
            }
            else
            {
                const tosend={
                    id:this.state.renderapplications[ind]._id,
                    job:this.state.renderapplications[ind].job._id,
                    applicant:this.state.renderapplications[ind].applicant._id,
                    sop:this.state.renderapplications[ind].sop,
                    status:value
                }

                console.log(tosend)
                const res = await axios.put('http://localhost:4000/appl/user/create', tosend)
                // this.forceUpdate()
                const newoncl=!(this.state.oncl)
                this.setState((prevState)=>{
                   return( {
                        ...prevState,
                        oncl:newoncl
                    })
                })
            }
        }catch(err)
        {
            console.log(err)
        }

    }

    buttonDisplay(ind){
        if(this.state.renderapplications[ind].status==='Accepted')
        {
            return(
                <button type="button" className="btn btn-success btn-sm btn-block" disabled={true} >Accepted</button>
            )
        }

        if(this.state.renderapplications[ind].status==='Shortlisted')
        {
            return(
                <Row>
                    <Col>
                        <button type="button" className="btn btn-success btn-block" onClick={(event =>{
                            this.handleMod('Accepted',ind).then()
                        })}>Accept</button>
                    </Col>
                    <Col>
                        <button type="button" className="btn btn-danger btn-block" onClick={(event =>{
                            this.handleMod('Rejected',ind).then()
                        })}>Reject</button>
                    </Col>
                </Row>
            )
        }

        else{
            return(
                <Row>
                    <Col>
                        <button type="button" className="btn btn-success btn-block" onClick={(event =>{
                            this.handleMod('Shortlisted',ind).then()
                        })}>Shortlist</button>
                    </Col>
                    <Col>
                        <button type="button" className="btn btn-danger btn-block" onClick={(event =>{
                            this.handleMod('Rejected',ind).then()
                        })}>Reject</button>
                    </Col>
                </Row>
            )
        }
    }


    onApplyClick(ind){
        // if (this.state.userstatus.isSelected === 1) {
        //     alert('You have already been selected')
        //     return false
        // }
        //
        // if (this.state.userstatus.num_applications >= 10) {
        //     alert('You have already been selected')
        //     return false
        // }
        // console.log(this.state.user)
        //
        // this.props.history.push({
        //     pathname:'/user/SOP',
        //     state: {
        //         applicant: this.state.user._id,
        //         job: this.state.jobs[ind]._id,
        //         status: 'Applied',
        //     }
        // })

    }

    async loadData(){
        try {
            console.log("Did it mount?")
            const res = await axios.post('http://localhost:4000/appl/recruiter/job', {'job_id':this.props.location.state._id})
            console.log(JSON.stringify(res.data,null,2))

            var arr=[];
            for (let i = 0; i < res.data.length; i++) {
                arr.push(false)
            }

            this.setState( (prevState)=>{
                return({
                    applications:res.data,
                    expandstate:[...arr],
                    renderapplications:res.data
                })
            })

        }catch(err){
            console.log(err)
        }
    }

    componentDidMount(){
        this.loadData().then()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.oncl !== this.state.oncl)
        {
            console.log("Called now?")
            this.loadData().then()
        }
    }

    handleClick(ind){
        this.setState((prevState) =>{
            prevState.expandstate[ind]=!prevState.expandstate[ind]
            console.log(prevState)
            return prevState
        })
    }

    sortChange(ind){

        const state=(this.state.sortstate[ind]+1)%3
        this.setState((prevState) => {
            const newsortstate=[2,2,2]
            newsortstate[ind]=(prevState.sortstate[ind]+1)%3
            return({
                ...prevState,
                sortstate:newsortstate,
            })
        })
        if(state!==2)
        {
            var array = this.state.renderapplications;
            var flag = this.state.sortstate[ind];
            var type=this.state.sortby[ind]
            array.sort(function(a, b) {
                if(ind===1)
                {
                    console.log(a[type])
                    if(a[type] !== undefined && b[type] !== undefined){
                        return (flag*2-1) * (new Date(a[type]) - new Date(b[type]));
                    }
                    else{
                        return 1;
                    }
                }
                else
                {
                    console.log(a.applicant[type])

                    if(a.applicant[type] !== undefined && b.applicant[type] !== undefined){
                        if(ind===0)
                        {
                            if(a.applicant[type]===b.applicant[type])
                            {
                                return 0
                            }
                            if(a.applicant[type]<b.applicant[type])
                            {
                                console.log("Yes")
                                return (flag*2-1) * -1
                            }
                            console.log("No")
                            return (flag*2-1) * 1;


                        }
                        return (flag*2-1) * (a.applicant[type] - b.applicant[type]);
                    }
                    else{
                        return 1;
                    }
                }
            });
            this.setState((prevState) => {
                return({
                    renderapplications:prevState.applications,
                    ...prevState,
                })
            })
        }
        else{
            const arr=this.state.applications
            this.setState((prevState) => {
                return({
                    ...prevState,
                    renderapplications:arr,
                })
            })
        }
    }

    renderIcon(ind){
        if(this.state.sortstate[ind]===0){
            return(
                <ArrowUpwardIcon/>
            )
        }
        else if(this.state.sortstate[ind]===1){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else
        {
            return(
                <RemoveIcon/>
            )
        }
    }

     render() {
        // return(<br/>)
        return (
            <div>
                <Grid container>
                    <Grid item xs={12} md={9} lg={9}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name<Button onClick={(event)=>{this.sortChange(0)}}>{this.renderIcon(0)}</Button></TableCell>
                                        <TableCell>Date of Application/Accept<Button onClick={(event)=>{this.sortChange(1)}}>{this.renderIcon(1)}</Button></TableCell>
                                        <TableCell>Rating<Button onClick={(event)=>{this.sortChange(2)}}>{this.renderIcon(2)}</Button></TableCell>
                                        <TableCell>Stage of Application</TableCell>
                                        <TableCell>Skills</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="accordion" id="accordionExample">
                                    {this.state.renderapplications.map((application,ind) => (
                                        <>
                                            <TableRow key={ind}  data-toggle="collapse" data-target={'#'+ind}
                                                      aria-expanded="true" aria-controls={ind} onClick={(event)=>{this.handleClick(ind)}}>
                                                <TableCell>{application.applicant.name}</TableCell>
                                                <TableCell>{moment(application.date_accept).format("YYYY-MM-DD HH:mm")}</TableCell>
                                                <TableCell>{application.applicant.rating}</TableCell>
                                                <TableCell>{application.status}</TableCell>
                                                <TableCell>{application.applicant.skills.join()}</TableCell>
                                            </TableRow>
                                            <TableRow >
                                                <TableCell style={{backgroundColor:'#D3D3D3'}} colSpan={5} id={ind} className={this.state.expandstate[ind] ? 'collapse show' : 'collapse'}
                                                           aria-labelledby={"heading"+ind} data-parent="#accordionExample" >
                                                    <div>
                                                        <strong>Education:</strong>
                                                        <br/>
                                                    </div>
                                                    <Row>
                                                        {application.applicant.education.map((edu,ind)=>{
                                                            return(
                                                                <>
                                                                    <Col xs={7}>
                                                                        <strong>Institute Name:</strong>{edu.institute}
                                                                    </Col>

                                                                    <Col>
                                                                        <strong>Start:</strong>{edu.start}
                                                                    </Col>

                                                                    <Col>
                                                                        <strong>End:</strong>{edu.end}
                                                                    </Col>
                                                                </>
                                                            )
                                                        })}
                                                    </Row>
                                                    <br/>
                                                    <div>
                                                        <strong>SOP:</strong>
                                                        <br/>
                                                        {application.sop}
                                                    </div>
                                                    <div className="card-body">
                                                        {this.buttonDisplay(ind)}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default Rec_Applicants;

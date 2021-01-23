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

class JobList extends Component {
    
    constructor(props) {
        super(props);
        this.state = {jobs: [],userstatus: [],expandstate:[],user:'',sortby:['duration','salary','rating'],sortstate:[2,2,2],renderjobs:[],searchtab:'',typefilter:'None',minsal:'',maxsal:'',maxdur:''};
        var ini=[]
        this.initial=[true,false,false]

        // console.log(this.fuse.search("Ma"))
        this.renderIcon = this.renderIcon.bind(this);
        this.sortChange = this.sortChange.bind(this);
        this.handleClick=this.handleClick.bind(this);
        this.buttonDisplay=this.buttonDisplay.bind(this);
        this.onApplyClick=this.onApplyClick.bind(this);
        this.handleSearch=this.handleSearch.bind(this);
    }

    handleSearch(){
        this.setState((prevState)=>{
            const fuse = new Fuse(this.state.jobs, {
                includeScore:true,
                keys: ['title']
            })
            // const search=this.state.searchtab
            const arr=fuse.search(this.state.searchtab)
            const update=arr.map((el,ind)=>el.item)
            return(
                {
                    ...prevState,
                    renderjobs:update
                }
            )
        })

    }
    buttonDisplay(ind){
        if(this.state.jobs[ind].app_status==='None')
        {
            console.log("Inside button")
            console.log(this.state.jobs[ind].max_applications,this.state.jobs[ind].num_applicants)
            if((this.state.jobs[ind].max_applications === this.state.jobs[ind].num_applicants) || (this.state.jobs[ind].max_positions === this.state.jobs[ind].num_selected)){
                return(<button type="button"
                               className="btn btn-secondary btn-block" disabled={true}>Full
                </button>)
            }
            return(<button type="button"
                           className="btn btn-success btn-block" onClick={(event) =>{this.onApplyClick(ind)}}>Apply
            </button>)
        }
        else{
            return(<button type="button"
                           className="btn btn-warning btn-block" disabled={true} >Applied
            </button>)
        }
    }


    onApplyClick(ind){
        if (this.state.userstatus.isSelected === 1) {
            alert('You have already been selected')
            return false
        }

        if (this.state.userstatus.num_applications >= 10) {
            alert('You have already been selected')
            return false
        }
        console.log(this.state.user)

        this.props.history.push({
            pathname:'/user/SOP',
            state: {
                applicant: this.state.user._id,
                job: this.state.jobs[ind]._id,
                status: 'Applied',
            }
        })

    }

    componentDidMount() {
        const loadData= async () =>{
            try {
                console.log("didmount")
                const user= await axios.post('http://localhost:4000/profile/applicant/me',{'userid':Cookies.get('userid')})
                console.log(user.data)
                const res = await axios.post('http://localhost:4000/job/all', {'applicantid':user.data._id})
                console.log(JSON.stringify(res.data.userstatus))
                console.log(JSON.stringify(res.data.jobs))
                var i;
                var arr=[];
                for (i = 0; i < res.data.jobs.length; i++) {
                    arr.push(false)
                }

                console.log(user.data)
                this.setState({
                    jobs:res.data.jobs,
                    userstatus:res.data.userstatus,
                    expandstate:[...arr],
                    user:user.data,
                    renderjobs:res.data.jobs
                })
            }catch(err){
                console.log(err)
            }
        }
        loadData().then()
    }

    handleClick(ind){
        console.log(typeof this.state.userstatus.isSelected)
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
            var array = this.state.renderjobs;
            var flag = this.state.sortstate[ind];
            var type=this.state.sortby[ind]
            array.sort(function(a, b) {
                if(a[type] !== undefined && b[type] !== undefined){
                    return (flag*2-1) * (a[type] - b[type]);
                }
                else{
                    return 1;
                }
            });
            this.setState((prevState) => {
                return({
                    renderjobs:prevState.jobs,
                    ...prevState,
                })
            })
        }
        else{
            const arr=this.state.jobs
            this.setState((prevState) => {
                return({
                    ...prevState,
                    renderjobs:arr,
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
        return (
            <div>
                <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                                        <h3>Filters</h3>
                        </ListItem>
                    </List>
                        <List component="nav" aria-label="mailbox folders">
                            <ListItem>
                                <TextField
                                    id="standard-basic"
                                    label="Title"
                                    value={this.state.searchtab}
                                    onChange={(event)=>{
                                        event.persist()
                                        console.log(this.state.searchtab)
                                        this.setState((prevState)=>
                                        {return({
                                            ...prevState,
                                            searchtab:event.target.value
                                        })})}}
                                />
                            </ListItem>
                            <ListItem button>
                                <form autoComplete="off">
                                    <label>Salary</label>
                                    <TextField id="standard-basic" value={this.state.minsal} onChange={(event)=>{
                                        event.persist()
                                        this.setState((prevState)=>{
                                            return(
                                                {
                                                    ...prevState,
                                                    minsal:event.target.value
                                                }
                                            )
                                        })
                                    }}
                                    label="Enter Min" fullWidth={true} />

                                    <TextField id="standard-basic" value={this.state.maxsal} onChange={(event)=>{
                                        event.persist()
                                        this.setState((prevState)=>{
                                            return(
                                                {
                                                    ...prevState,
                                                    maxsal:event.target.value
                                                }
                                            )
                                        })
                                    }} label="Enter Max" fullWidth={true} />
                                </form>                                                                
                            </ListItem>
                            <ListItem button divider>
                                <FormControl  fullWidth={true} variant="filled" className={classes.formControl}>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        value={this.state.maxdur}

                                        onChange={(event)=>{
                                            event.persist()
                                            this.setState((prevState)=>{
                                                return(
                                                    {
                                                        ...prevState,
                                                        maxdur: event.target.value
                                                    }
                                                )
                                            })
                                        }}
                                    >
                                        <MenuItem value={0}>
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={1}>1</MenuItem>
                                        <MenuItem value={2}>2</MenuItem>
                                        <MenuItem value={3}>3</MenuItem>
                                        <MenuItem value={4}>4</MenuItem>
                                        <MenuItem value={5}>5</MenuItem>
                                        <MenuItem value={6}>6</MenuItem>
                                        <MenuItem value={7}>7</MenuItem>
                                    </Select>
                                </FormControl>
                            </ListItem>
                            <Divider />
                            <ListItem button divider>
                                <FormControl  fullWidth={true} variant="filled" className={classes.formControl}>
                                    <InputLabel>Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-filled-label"
                                        id="demo-simple-select-filled"
                                        value={this.state.typefilter}

                                        onChange={(event)=>{
                                            event.persist()
                                            this.setState((prevState)=>{
                                                return(
                                                    {
                                                        ...prevState,
                                                        typefilter: event.target.value
                                                    }
                                                )
                                            })
                                        }}
                                    >
                                        <MenuItem value="None">
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"parttime"}>Part Time</MenuItem>
                                        <MenuItem value={"fulltime"}>Full Time</MenuItem>
                                        <MenuItem value={"wfh"}>Work From Home</MenuItem>
                                    </Select>
                                </FormControl>
                            </ListItem>
                            <ListItem>
                                {/* This Button uses a Font Icon, see the installation instructions in the Icon component docs. */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                >
                                    Filter
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.button}
                                >
                                    Reset
                                </Button>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={12} md={9} lg={9}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Recruiter</TableCell>
                                            <TableCell>Duration<Button onClick={(event)=>{this.sortChange(0)}}>{this.renderIcon(0)}</Button></TableCell>
                                            <TableCell>Salary<Button onClick={(event)=>{this.sortChange(1)}}>{this.renderIcon(1)}</Button></TableCell>
                                            <TableCell>Rating<Button onClick={(event)=>{this.sortChange(2)}}>{this.renderIcon(2)}</Button></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody className="accordion" id="accordionExample">
                                        {this.state.renderjobs.map((job,ind) => (
                                                <>
                                                <TableRow key={ind}  data-toggle="collapse" data-target={'#'+ind}
                                                          aria-expanded="true" aria-controls={ind} onClick={(event)=>{this.handleClick(ind)}}>
                                                                    <TableCell>{job.title}</TableCell>
                                                                    <TableCell>{job.recruiter.name}</TableCell>
                                                                    <TableCell>{job.duration}</TableCell>
                                                                    <TableCell>{job.salary}</TableCell>
                                                                    <TableCell>{job.rating}</TableCell>
                                                </TableRow>
                                                    <TableRow  >
                                                        <TableCell style={{backgroundColor:'#D3D3D3'}} colSpan={5} id={ind} className={this.state.expandstate[ind] ? 'collapse show' : 'collapse'}
                                                                   aria-labelledby={"heading"+ind} data-parent="#accordionExample" >
                                                        <div className="card-body">
                                                            <Row>
                                                                <Col>
                                                                    <strong>Deadline Of Application:</strong> {moment(job.deadline).format("YYYY-MM-DD HH:mm")}
                                                                </Col>
                                                                <Col>
                                                                    <strong>Date of Posting:</strong>{moment(job.deadline).format("YYYY-MM-DD")}
                                                                </Col>
                                                            </Row>

                                                            <Row>
                                                                <Col>
                                                                    <strong>Skills Required:</strong> {job.skills.join()}
                                                                </Col>

                                                                <Col>
                                                                    <strong>Type Of Job:</strong>{job.type}
                                                                </Col>
                                                            </Row>
                                                            <br/>
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

export default JobList;

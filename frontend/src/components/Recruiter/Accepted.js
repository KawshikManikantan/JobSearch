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
import Cookies from "js-cookie";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import {classes} from "istanbul-lib-coverage";
import RateText from "../templates/RateText";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import RemoveIcon from "@material-ui/icons/Remove";



class Accepted extends Component {

    constructor(props) {
        super(props);
        this.state = {originalpeople:[],acceptedpeople: [], sortby:['name','rating','title','date_accept','type'],sortstate:[2,2,2,2,2],renderprops:true};
        this.sortChange = this.sortChange.bind(this);
        this.buttonDisplay=this.buttonDisplay.bind(this);
        this.reloadCall=this.reloadCall.bind(this)
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

    reloadCall()
    {
        console.log('function called')
        this.setState((prevState)=>{
            return(
                {
                    ...prevState,
                    renderprops:!(prevState.renderprops)
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
    sortChange(ind){
        const state=(this.state.sortstate[ind]+1)%3
        this.setState((prevState) => {
            const newsortstate=[2,2,2,2,2]
            newsortstate[ind]=(prevState.sortstate[ind]+1)%3
            return({
                ...prevState,
                sortstate:newsortstate,
            })
        })
        if(state!==2)
        {
            var array = this.state.acceptedpeople;
            var flag = this.state.sortstate[ind];
            var type=this.state.sortby[ind]
            array.sort(function(a, b) {
                if(ind===1)
                {
                    if(a[type] !== undefined && b[type] !== undefined){
                        return (flag*2-1) * (a[type] - b[type]);
                    }
                    else{
                        return 1;
                    }
                }
                else{

                    if(a[type]===b[type])
                    {
                        return 0
                    }
                    if(a[type]<b[type])
                    {
                        console.log("Yes")
                        return (flag*2-1) * -1
                    }
                    console.log("No")
                    return (flag * 2 - 1);
                }

            });
            this.setState((prevState) => {
                return({
                    renderjobs:prevState.jobs,
                    ...prevState,
                })
            })
        }
    }
    componentDidMount() {
        const loadData= async () =>{
            try {
                console.log("didmount")
                const res= await axios.post('http://localhost:4000/appl/recruiter/accepted',{'userid':Cookies.get('userid')})
                console.log(res.data)
                this.setState({
                    originalpeople:res.data,
                    acceptedpeople:res.data.map((dat,ind)=> {
                        return(
                            {
                                name:dat.applicant.name,
                                title:dat.job.title,
                                type:dat.job.type,
                                date_accept:dat.date_accept,
                                rating:dat.applicant.rating
                            }
                        )
                    })
                    }
                )

            }catch(err){
                console.log(err)
            }
        }
        loadData().then()
    }
    render() {
        return (
            <div>
                <Grid item xs={12} md={9} lg={9}>
                    <Paper>
                        <Table size="large">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name<Button onClick={(event)=>{this.sortChange(0)}}>{this.renderIcon(0)}</Button></TableCell>
                                    <TableCell>Rating<Button onClick={(event)=>{this.sortChange(1)}}>{this.renderIcon(1)}</Button></TableCell>
                                    <TableCell>Job Title<Button onClick={(event)=>{this.sortChange(2)}}>{this.renderIcon(2)}</Button></TableCell>
                                    <TableCell>Date of Joining<Button onClick={(event)=>{this.sortChange(3)}}>{this.renderIcon(3)}</Button></TableCell>
                                    <TableCell>Job Type<Button onClick={(event)=>{this.sortChange(4)}}>{this.renderIcon(4)}</Button></TableCell>
                                    <TableCell>Rate Applicant </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.acceptedpeople.map((application,ind) => (
                                    <TableRow>
                                        <TableCell>{application.name}</TableCell>
                                        <TableCell>{application.rating}</TableCell>
                                        <TableCell>{application.title}</TableCell>
                                        <TableCell>{application.date_accept}</TableCell>
                                        <TableCell>{application.type}</TableCell>
                                        <TableCell><RateText application={this.state.originalpeople[ind]} type={"Recruiter"} call={this.reloadCall}/></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </div>
        )
    }
}

export default Accepted;

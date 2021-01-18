import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

export default class NavBar extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        const listItems = this.props.elements.map((element) =>
            <li className="navbar-item">
                <Link to={element.link} className="nav-link">{element.title}</Link>
            </li>
        );
        return (
            <div>                
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <Link to="/" className="navbar-brand">Home</Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">
                            {listItems}
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}

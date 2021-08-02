import React, { Component } from "react";
import {Navbar} from 'react-bootstrap';
import firebase from "../firebase";

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
            name: '',
        }
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({signedIn: true, name: firebase.auth().currentUser.displayName})
            } else {
                // No user is signed in.

            }
        });
    }

    render() {
        return (
            <Navbar >
                <Navbar.Brand href="/">PMT Admin Panel</Navbar.Brand>
                <Navbar.Toggle/>
                <Navbar.Collapse className="justify-content-end">
                    {this.state.signedIn && <Navbar.Text>
                        Signed in as: <a href="/profile/">{this.state.name}</a>
                    </Navbar.Text>}
                    {!this.state.signedIn && <Navbar.Text>
                        <a href="/login/">Login</a>
                    </Navbar.Text>}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavigationBar;



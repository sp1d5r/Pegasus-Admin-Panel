import React, { Component } from "react";
import {Button, Navbar} from 'react-bootstrap';
import firebase from "../../firebase";

class Profile extends Component {
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
            <div style={{width: '100%', height: 1000}}>
                <Button variant={'danger'}  style={{height: 50, width: 100}} onClick={() => {firebase.auth().signOut().then(() => {window.location.href='/'})}}>
                Logout
                </Button>

            </div>
        );
    }
}

export default Profile;



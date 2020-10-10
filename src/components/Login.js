import React, {Component} from 'react';
import {Button, Form} from "react-bootstrap";
import firebase from "../firebase";
// need to have a title for each page,
// then i need to have a revision notes section
// then include a questions section, start with the layout first

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: false,
        }
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val.target.value;
        this.setState(state);
    }

    updateFirebaseDatabase = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
            window.location.href='/'
        }).catch(() =>  {
            // Handle Errors here.
            this.setState({error: true})
        });
    }

    render() {
        return(
            <div style={{height: 500, width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <div style={{height: 500, width: 500,display: 'block' ,marginLeft: 'auto', marginRight: 'auto', marginTop: 200, borderRadius: 10, backgroundColor: '#f0f0f0'}}>
                    <h1 style={{paddingTop: 30}}>Login</h1>

                    <Form.Group controlId="formCourseName" style={{textAlign: 'left', width: '70%', flex:1, display: 'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30}}>
                        <p style={{textAlign: 'left'}}>
                            Enter Email:
                        </p>
                        <Form.Control name="courseName" placeholder="Email" onChange={(val) => this.updateInputVal(val, 'email')}/>
                        <p style={{textAlign: 'left', marginTop: 30}}>
                            Enter Password:
                        </p>
                        <Form.Control name="password" type="password" placeholder="Password" onChange={(val) => this.updateInputVal(val, 'password')}/>

                        <Button variant="primary" onClick={() => this.updateFirebaseDatabase()} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}>
                            Login
                        </Button>
                    </Form.Group>
                </div>
            </div>
        )


}


}
export default Login;

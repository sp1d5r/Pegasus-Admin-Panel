import React, {Component} from 'react';
import Homepage from "../homepage/homepage";
import {Container, Form, Button, Breadcrumb} from 'react-bootstrap';
import { SwatchesPicker } from 'react-color';
import {FaPlus} from 'react-icons/fa';
import firebase from "../../firebase";

// need to have a title for each page,
// then i need to have a revision notes section
// then include a questions section, start with the layout first

class AddRevisionNotes extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.location.pathname.substring(20),
            topicID: '',
            topicName: '',
            topicDescription: '',
            visible: false,
            currentTopics: {}
        }
    }

    getCurrentTopics = () => {
        firebase.database().ref('courses/').child(this.state.courseID).on('value', (snapshot) => {
            let data = snapshot.val();
            let arr = data.topics;
            this.setState({currentTopics: arr});
            console.log(data);
            console.log(arr);
        })
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val.target.value;
        this.setState(state);
    }



    createNewTopic = () =>{
        firebase.database().ref('courses/'+this.state.courseID+'/revisionTopics/').
        push({
            topicDescription: this.state.topicDescription,
            topicName: this.state.topicName,
            visible: this.state.visible
        }).then(() => {window.location.href= '/course/'+this.state.courseID})
    }

    componentDidMount() {
        this.getCurrentTopics();
    }

    render(){

        return (
            <Container style={{textAlign: 'left'}}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href={"/course/"+this.state.courseID}>Course</Breadcrumb.Item>
                    <Breadcrumb.Item active>Add Revision Material</Breadcrumb.Item>
                </Breadcrumb>
                <h3>Create new revision material </h3>
                <p>Course ID: {this.state.courseID}</p>
                <Form>
                    <Form.Group>
                        <Form.Label>Revision Topic Name</Form.Label>
                        <Form.Control name="courseName" placeholder="Enter the topic name i.e. Algebra and Indices" onChange={(val) => this.updateInputVal(val, 'topicName')}/>
                        <Form.Text className="text-muted">
                            Don't include any extra details
                        </Form.Text>
                        <br/>
                        <Form.Control name="courseName" placeholder="Enter a brief description for the topic i.e. This topic covers Algebra and Indices, it goes over ... " onChange={(val) => this.updateInputVal(val, 'topicDescription')}/>
                        <Form.Text className="text-muted">
                            Just include what the topic includes.
                        </Form.Text>
                    </Form.Group>
                </Form>

                <Button style={{marginLeft:'50%', marginRight: 'auto', marginTop:50}} variant="success" onClick={this.createNewTopic}>Submit</Button>
                <br/>
            </Container>
        )
    }

}

export default AddRevisionNotes;

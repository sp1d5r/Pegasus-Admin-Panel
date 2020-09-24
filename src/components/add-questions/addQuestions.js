import React, {Component} from 'react';
import Homepage from "../homepage/homepage";
import {Container, Form, Button, Breadcrumb} from 'react-bootstrap';
import { SwatchesPicker } from 'react-color';
import {FaPlus} from 'react-icons/fa';
import Page from "../topic/page"
import firebase from "../../firebase";

// need to have a title for each page,
// then i need to have a revision notes section
// then include a questions section, start with the layout first

class AddQuestions extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.location.pathname.substring(15),
            topicID: '',
            topicName: '',
            questionsDescription: '',
            visible: false,
        }
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val.target.value;
        this.setState(state);
    }



    createNewTopic = () =>{
        firebase.database().ref('courses/'+this.state.courseID+'/questions/').
        push({
            questionsName: this.state.topicName,
            questionsDescription: this.state.questionsDescription,
            visible: this.state.visible,
            totalMarks: 0,
        }).then(() => {window.location.href= '/course/'+this.state.courseID})
    }

    render(){

        return (
            <Container style={{textAlign: 'left'}}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href={"/course/"+this.state.courseID}>Course</Breadcrumb.Item>
                    <Breadcrumb.Item active>Add Questions</Breadcrumb.Item>
                </Breadcrumb>
                <h3>Create new questions</h3>
                <p>Course ID: {this.state.courseID}</p>
                <Form>
                    <Form.Group>
                        <Form.Label>Questions Name</Form.Label>
                        <Form.Control name="courseName" placeholder="Enter the question name i.e. Algebra and Indices (1)" onChange={(val) => this.updateInputVal(val, 'topicName')}/>
                        <Form.Text className="text-muted">
                            Don't make the topics too long, separate them out with numbers
                        </Form.Text>
                        <br/>
                        <Form.Control name="courseName" placeholder="Enter a brief description for the questions i.e. This is the first set of questions for Algebra and Indices" onChange={(val) => this.updateInputVal(val, 'questionsDescription')}/>
                        <Form.Text className="text-muted">
                            Just include what the questions includes.
                        </Form.Text>
                    </Form.Group>
                </Form>

                <Button style={{marginLeft:'50%', marginRight: 'auto', marginTop:50}} variant="success" onClick={this.createNewTopic}>Submit</Button>
                <br/>
            </Container>
        )
    }

}

export default AddQuestions;

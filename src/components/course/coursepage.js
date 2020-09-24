import React, {Component} from 'react';
import Homepage from "../homepage/homepage";
import {Container, Form, Button, Breadcrumb,} from 'react-bootstrap';
import { SwatchesPicker } from 'react-color';
import {FaPlus} from 'react-icons/fa';
import {FaCheckCircle} from 'react-icons/fa';
import {FaTimesCircle} from 'react-icons/fa';
import firebase from "../../firebase";
import Course from "../homepage/course";
import RevisionTopic from "./revisionTopic";
import Questions from "./questions";

// need to have a title for each page,
// then i need to have a revision notes section
// then include a questions section, start with the layout first

class CoursePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.location.pathname.substring(8),
            courseName: '',
            description: '',
            level:'',
            subject: '',
            color: '',
            examBoard: '',
            visible: false,
            deleteConfirmation: false,
            topics: {},
            questions: {},
        }
    }

    getCourseInformation = async() => {
        await firebase.database().ref('courses/').child(this.state.courseID).once('value', (snapshot) => {
            let data = snapshot.val();
            this.setState(
                {
                    courseName: data.courseName,
                    courseLevel: data.courseLevel,
                    color: data.color,
                    subject: data.subject,
                    visible: data.visible,
                    description: data.description,
                    examBoard: data.examBoard,
                })

            let arr = []
            for (let key in data.revisionTopics) {
                if (data.revisionTopics.hasOwnProperty(key)) {
                    arr.push(key);
                }
            }
            this.setState({topics: arr});

            let arr1 = []
            for (let key in data.questions) {
                if (data.questions.hasOwnProperty(key)) {
                    arr1.push(key);
                }
            }
            this.setState({questions: arr1});
        })
    }

    deleteCoursePage = () => {
        this.setState({deleteConfirmation: true})
    }

    cancelDelete =() => {
        this.setState({deleteConfirmation: false})
    }

    makeVisible = () => {
        let topicData = firebase.database().ref('courses/').child(this.state.courseID)
        topicData.update({visible: true}).then(() => this.setState({visible: true}))
    }

    makeInvisible = () => {
        let topicData = firebase.database().ref('courses/').child(this.state.courseID)
        topicData.update({visible: false}).then(() => this.setState({visible: false}))
    }

    permadelete = () => {
        firebase.database().ref('search/'+this.state.subject).child(this.state.courseID).remove()
        firebase.database().ref('search/'+this.state.courseLevel).child(this.state.courseID).remove()
        firebase.database().ref('search/'+this.state.examBoard).child(this.state.courseID).remove()
        firebase.database().ref('courses/').child(this.state.courseID).remove()
    }

    createRevisionTopics = () => {
        let tempCourses = this.state.topics;
        let cID = this.state.courseID
        return tempCourses.map(function (topic) {
            return <RevisionTopic topicID={topic.toString()} courseID={cID}/>
        })
    }

    createQuestions = () => {
        let tempCourses = this.state.questions;
        let cID = this.state.courseID
        return tempCourses.map(function (topic) {
            return <Questions questionID={topic.toString()} courseID={cID}/>
        })
    }

    componentDidMount() {
        this.getCourseInformation().then(() => console.log(this.state))
    }


    render(){

        return (
            <Container style={{textAlign: 'left'}}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>{this.state.courseName}</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{display: 'flex'}}>
                <h3 style={{float:'left'}}>{this.state.courseName}</h3>
                <Button variant={"secondary"} href={'/edit/'+this.state.courseID} style={{float:'left', marginLeft: '60%'}}> Edit</Button>
                </div>
                <Form>
                    <Form.Group>
                        <h4>Course Attributes</h4>
                        <p style={{marginTop: 1, marginBottom: 1}}>Course ID: {this.state.courseID}</p>
                        <p style={{marginTop: 1, marginBottom: 1}}>Course Level: {this.state.courseLevel}</p>
                        <p style={{marginTop: 1, marginBottom: 1}}>Course Subject: {this.state.subject}</p>
                        <p style={{marginTop: 1, marginBottom: 1}}>Course Description: {this.state.description}</p>
                        <p style={{marginTop: 1, marginBottom: 1}}>Exam Board: {this.state.examBoard}</p>
                        <p>Course visible? {this.state.visible && <FaCheckCircle style={{color: 'green'}}/>} {!this.state.visible && <FaTimesCircle style={{color: 'red'}}/>}</p>
                        <Form.Text className="text-muted">
                            Adjust the attributes of the in the edit section
                        </Form.Text>
                    </Form.Group>
                </Form>

                <h4>Revision Notes</h4>
                <div style={styles.scrollableContainer}>
                    <div style={{flex: '0 0 20%', float: 'left', height: '95%', width: 100, backgroundColor: 'rgba(227, 227, 227, 0.2)', margin: '10px', borderRadius: 10}}>
                        <p style={{marginTop: '50%', textAlign: 'center'}}><a href={'/add-revision-notes/'+(this.state.courseID)}>Add Revision Material!</a></p>
                    </div>
                    {(this.state.topics.length>0) && this.createRevisionTopics()}
                </div>
                <h4>Questions and Answers</h4>
                <div style={styles.scrollableContainer}>
                    <div style={{flex: '0 0 20%', float: 'left', height: '95%', width: 100, backgroundColor: 'rgba(227, 227, 227, 0.2)', margin: '10px', borderRadius: 10}}>
                        <p style={{marginTop: '50%', textAlign: 'center'}}><a href={'/add-questions/'+(this.state.courseID)}>Add Questions and Answers</a></p>
                    </div>
                    {(this.state.questions.length>0) && this.createQuestions()}
                </div>

                <br/>
                <br/>
                { !this.state.visible && <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 50}} variant={'success'} onClick={this.makeVisible}>Make Visible!</Button>}
                { this.state.visible && <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 50}} variant={'success'} onClick={this.makeInvisible}>Make Invisible!</Button>}


                <div>
                    {!this.state.deleteConfirmation && <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 100}} variant={'danger'} onClick={this.deleteCoursePage}>Delete Course</Button>}
                    {this.state.deleteConfirmation &&
                        <div>
                            <h4 style={{textAlign: 'center'}}>Are you sure you want to permanently delete this course?</h4>
                            <div style={{width:'100%'}}>
                                <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, width: 200}} variant={'danger'} onClick={this.permadelete} href={'/'}>Permanantly Delete </Button>
                                <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 100}} variant={'secondary'} onClick={this.cancelDelete}>Cancel</Button>
                            </div>
                            </div>
                        }
                </div>
            </Container>
        )
    }

}
const styles = {
    scrollableContainer: {
        display: 'flex', width: '100%', height: 200, backgroundColor: '#fafafa', overflowX: 'auto',
        overflowY: 'hidden', borderRadius: 10, alignItems: 'center'
    }
};

export default CoursePage;

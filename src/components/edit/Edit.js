import React, {Component} from 'react';
import {Container, Form, Button, Alert, Breadcrumb} from 'react-bootstrap';
import firebase from "../../firebase";
import {SwatchesPicker} from "react-color";

class Edit extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.location.pathname.substring(6),
            courseName: '',
            description: '',
            oldLevel: '',
            oldSubject: '',
            oldExamBoard: '',
            level:'',
            subject: '',
            color: '',
            examBoard: '',
            added: false
        }
    }

    handleChangeComplete = (color) => {
        this.setState({ color: color.hex });
    };

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val.target.value;
        this.setState(state);
    }

    getCourseInformation = async() => {
        await firebase.database().ref('courses/').child(this.state.courseID).once('value', (snapshot) => {
            let data = snapshot.val();
            this.setState(
                {
                    courseName: data.courseName,
                    courseLevel: data.courseLevel,
                    color: data.color,
                    oldSubject: data.subject,
                    oldExamBoard: data.examBoard,
                    oldLevel: data.courseLevel,
                    subject: data.subject,
                    level: data.courseLevel,
                    description: data.description,
                    examBoard: data.examBoard
                })
        })
    }

    updateFirebaseDatabase = async() => {
        firebase.database().ref('search/'+this.state.oldSubject).child(this.state.courseID).remove().then(() =>{
            firebase.database().ref('search/'+this.state.oldLevel).child(this.state.courseID).remove().then(() => {
                firebase.database().ref('search/'+this.state.oldExamBoard).child(this.state.courseID).remove()
            })
        })

        console.log(this.state);
        let newEntry = firebase.database().ref('courses/').child(this.state.courseID)
        let key = this.state.courseID;
        newEntry.update({
            color: this.state.color,
            courseName: this.state.courseName,
            description: this.state.description,
            subject: this.state.subject,
            examBoard: this.state.examBoard,
            courseLevel:this.state.level,
        }).then(() =>
            this.setState({added: true}, () => console.log(this.state))
        ).then(
            () => firebase.database().ref('search/'+this.state.level+'/').child(key).set({set: true})
        ).then(
            () => firebase.database().ref('search/'+this.state.examBoard+'/').child(key).set({set: true})
        ).then(
            () => firebase.database().ref('search/'+this.state.subject+'/').child(key).set({set: true})
        ).then(() => window.location.href='/')
    }

    componentDidMount() {
        this.getCourseInformation().then(() => console.log('retrieved course info'))
    }

    render() {
        return (
            <Container style={{textAlign: 'left'}}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href={"/course/"+this.state.courseID}>Course</Breadcrumb.Item>
                    <Breadcrumb.Item active>Edit Course</Breadcrumb.Item>
                </Breadcrumb>
                <h3 style={{textAlign: 'left'}}>Edit Course!!</h3>
                <p style={{textAlign: 'left'}}>Change any details you want, details you don't change remain the same</p>
                <br/>
                <Form>
                    <Form.Group controlId="formCourseName">
                        <Form.Label>Course Name</Form.Label>
                        <Form.Control name="courseName" placeholder={this.state.courseName} onChange={(val) => this.updateInputVal(val, 'courseName')}/>
                        <Form.Text className="text-muted">
                            Include Subject - Level - Exam Board
                        </Form.Text>
                    </Form.Group>


                    <Form.Group controlId="formCourseName">
                        <Form.Label>Select an Exam Board</Form.Label>
                        <Form.Control as="select" name={"level"} value={this.state.examBoard} placeholder={"Select the exam board"} onChange={(val) => this.updateInputVal(val, 'examBoard')}>
                            <option value="Select">Select</option>
                            <option value="None">None</option>
                            <option value="WJEC">WJEC</option>
                            <option value="Edexcel">Edexcel</option>
                            <option value="OCR">OCR</option>
                            <option value="AQA">AQA</option>
                            <option value="CCEA">CCEA</option>
                        </Form.Control>
                        <Form.Text className="text-muted">
                            Select which exam board the subject is
                        </Form.Text>
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Course Description</Form.Label>
                        <Form.Control as="textarea" name="courseName" rows="2" placeholder={this.state.description} onChange={(val) => this.updateInputVal(val, 'description')}/>
                        <Form.Text className="text-muted">
                            Try to keep it around a paragraph long, it's a short description.
                        </Form.Text>
                    </Form.Group>

                    <div style={{width: '100%', alignItems: 'center', justifyContent:'center', marginBottom: 270}}>
                        <div>
                            <Form.Group controlId="formBasicPassword" style={{float: 'left' , marginRight: 100, marginTop: 20}}>
                                <Form.Label>Select a Level</Form.Label>
                                <Form.Control as="select" name={"level"} value={this.state.level} placeholder={"Select the level"} onChange={(val) => this.updateInputVal(val, 'level')}>
                                    <option value="Select">Select</option>
                                    <option value="GCSE">GCSE</option>
                                    <option value="IGCSE">IGCSE</option>
                                    <option value="A-Level"> A-Level</option>
                                    <option value="PreU">PRE-U</option>
                                </Form.Control>
                                <Form.Text className="text-muted">
                                    Select which level the course is
                                </Form.Text>
                                <Form.Label>Select a Subject</Form.Label>
                                <Form.Control as="select" name={"subject"} value={this.state.subject} placeholder={"Select the Subject"} onChange={(val) => this.updateInputVal(val, 'subject')}>
                                    <option value="select">Select</option>
                                    <option value="Art">Art</option>
                                    <option value="Biology">Biology</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="Economics">Economics</option>
                                    <option value="English">English</option>
                                    <option value="English Literature">English Literature</option>
                                    <option value="English Language">English Language</option>
                                    <option value="French">French</option>
                                    <option value="Further Mathematics">Further Mathematics</option>
                                    <option value="Geography">Geography</option>
                                    <option value="German">German</option>
                                    <option value="History">History</option>
                                    <option value="IT & Computing">IT & Computing</option>
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Music">Music</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Politics">Politics</option>
                                    <option value="RS">RS</option>
                                    <option value="Science">Science</option>
                                    <option value="Spanish">Spanish</option>
                                </Form.Control>
                                <Form.Text className="text-muted">
                                    Select which level the course is
                                </Form.Text>
                            </Form.Group>
                        </div>
                        <Form.Group style={{float: 'left', marginLeft: 100}}>
                            <Form.Label>Background Color</Form.Label>
                            <SwatchesPicker
                                color={ this.state.color }
                                onChangeComplete={ this.handleChangeComplete }
                            />
                        </Form.Group>
                    </div>

                    <br/>
                    <br/>
                    <h3>Preview </h3>
                    <div style={{marginLeft: 'auto', marginRight:'auto', marginBottom: 300, marginTop: 30}}>
                        <div style={{height: 270, width:200, float:'left', backgroundColor: this.state.color, color: 'inherit', textDecoration: 'none', borderRadius:10, marginLeft: 100}}>
                            <div style={{height: '70%'}}>
                            </div>
                            <div style={{backgroundColor: 'rgb(255,255,255,0.2)', height:'30%'}}>
                                <h3 style={{textAlign: 'left', color: 'white', fontSize: 20, paddingLeft: 10, marginBottom: 0}}>{this.state.courseName}</h3>
                                <h4 style={{textAlign: 'left', color: 'white', fontSize: 15, paddingLeft: 10, marginBottom: 0}}>{this.state.level}</h4>
                                <p style={{textAlign: 'left', color: 'grey', fontSize: 10, paddingLeft:10,}}>courseid</p>
                            </div>
                        </div>
                        <div style={{height: 300, width:600, float:'left', backgroundColor:'#fafafa', marginLeft: 100, borderRadius: 10}}>
                            <div style={{height: '25%', width:'100%', float:'left', backgroundColor:this.state.color, borderTopRightRadius: 10, borderTopLeftRadius: 10}}>
                                <h3 style={{textAlign: 'left', color: 'white', fontSize: 20, paddingLeft: 10, marginTop: '1%', marginBottom: 0}}>{this.state.courseName}</h3>
                                <h4 style={{textAlign: 'left', color: 'white', fontSize: 15, paddingLeft: 10, marginBottom: 0}}>{this.state.level}</h4>
                                <p style={{textAlign: 'left', color: 'grey', fontSize: 10, paddingLeft:10,}}>courseid</p>
                            </div>
                            <div style={{padding: 20, paddingTop: 70, marginTop: 20, whiteSpace: 'pre-line'}}>
                                <p>{this.state.description}</p>
                            </div>

                        </div>
                    </div>

                    <br/>
                    <br/>


                    <br/>
                    <br/>
                    {this.state.added && <div><Alert variant={"success"}> Success </Alert> <br/> <Button href={'/'} variant={"success"} style={{marginLeft:'auto', marginRight: 'auto', marginBottom: 300}}>Finish</Button> </div>}
                    {!this.state.added && <Button variant="primary" onClick={() => this.updateFirebaseDatabase()} style={{justifyContent: 'center', alignItems: 'center', marginLeft: '50%', marginBottom: 50}}>
                        Submit
                    </Button>}

                </Form>
            </Container>
        );
    }
}

export default Edit;

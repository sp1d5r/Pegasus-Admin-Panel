import React, {Component} from 'react';
import {Breadcrumb, Button, Container,} from "react-bootstrap";
import firebase from "../../firebase";
import RevisionTopic from "../course/revisionTopic";
import QuestionCard from "./questionCard";
class QuestionPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.location.pathname.split('/')[2],
            questionID: this.props.location.pathname.split('/')[3],
            questionsName: '',
            questionsDescription:'',
            visible: false,
            pages: [],
            topicIDExists: false,
            deleteConfirmation: false,
        }
    }

    deleteCoursePage = () => {
        this.setState({deleteConfirmation: true})
    }

    cancelDelete =() => {
        this.setState({deleteConfirmation: false})
    }

    permadelete = () => {
        firebase.database().ref('courses/'+this.state.courseID+'/questions/'+this.state.questionID).remove()
        firebase.database().ref('topics/').child(this.state.questionID).remove()
    }

    retrieveTopicData = async () =>{
        await firebase.database().ref('courses/'+this.state.courseID+'/questions').child(this.state.questionID).once('value', (snapshot) => {
            let data = snapshot.val();
            this.setState(
                {
                    questionsName: data.questionsName,
                    questionsDescription: data.questionsDescription,
                    visible: data.visible,
                })
        })
    }

    getTopicData = () => {
        console.log('does it exists:' + this.state.topicIDExists)
         if (!this.state.topicIDExists) {
             firebase.database().ref('questions/').child(this.state.questionID)
                 .set({questionsName: this.state.questionsName,})
                 .then(() => {console.log()})
         } else {
             firebase.database().ref('questions/'+this.state.questionID).once('value', (snapshot) => {
                     let data = snapshot.val();
                     let arr = []
                     for (let key in data.questionPages) {
                         if (data.questionPages.hasOwnProperty(key)) {
                             arr.push(key);
                         }
                     }
                     this.setState({pages: arr});
             }
             ).then(() => {console.log('the number of pages is :'+ this.state.pages)})
         }

    }

    createPages = () => {
        let tempCourses = this.state.pages;
        let cID = this.state.courseID;
        let questionID= this.state.questionID;
        return tempCourses.map(function (topic) {
            console.log('loading the course'+ topic.toString());
            return <QuestionCard questionPageID={topic.toString()} questionID={questionID} courseID={cID}/>
        })
    }

    updateExists = async () => {
        await firebase.database().ref("questions/"+this.state.questionID).once('value', (snapshot) => {
            let exists = snapshot.exists();
            this.setState({topicIDExists: exists})
        })
    }

    makeVisible = () => {
        let topicData = firebase.database().ref('courses/'+this.state.courseID+'/questions/'+this.state.questionID+'/')
        topicData.set({
            questionsDescription: this.state.questionsDescription,
            questionsName: this.state.questionsName,
            visible: true
        }).then(() => this.setState({visible: true}))
    }

    makeInvisible = () => {
        let topicData = firebase.database().ref('courses/'+this.state.courseID+'/questions/'+this.state.questionID+'/')
        topicData.set({
            questionsDescription: this.state.questionsDescription,
            questionsName: this.state.questionsName,
            visible: false
        }).then(() => this.setState({visible: false}))
    }

    componentDidMount() {
        this.retrieveTopicData().then(() => {this.updateExists().then(() => this.getTopicData())})
    }

    render() {
        return (
            <Container style={{textAlign: 'left', marginBottom: 5}}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href={"/course/"+this.state.courseID}>Course</Breadcrumb.Item>
                    <Breadcrumb.Item active>{this.state.questionsName}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>Questions Name: {this.state.questionsName}</h3>
                <h4>description: {this.state.questionsDescription}</h4>
                <p style={{marginBottom: 5}}>The Course ID: {this.state.courseID}</p>
                <p style={{marginBottom: 5}}>The Question ID: {this.state.questionID}</p>
                <br/>
                <h4>Questions</h4>
                <div style={styles.scrollableContainer}>
                    <div style={{flex: '0 0 20%', float: 'left', height: '95%', width: 100, backgroundColor: 'rgba(227, 227, 227, 0.2)', margin: '10px', borderRadius: 10}}>
                        <p style={{marginTop: '50%', textAlign: 'center'}}><a href={'/add-question-pages/'+(this.state.questionID
                        )+'/'+(this.state.courseID) +'/'+(this.state.pages.length + 1)+'/'}>Add a Page!</a></p>
                    </div>
                    {(this.state.pages.length>0) && this.createPages()}
                </div>



                { !this.state.visible && <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 50}} variant={'success'} onClick={this.makeVisible}>Make Visible!</Button>}
                { this.state.visible && <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 50}} variant={'success'} onClick={this.makeInvisible}>Make Invisible!</Button>}
                <div>
                    {!this.state.deleteConfirmation && <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 100}} variant={'danger'} onClick={this.deleteCoursePage}>Delete Topic</Button>}
                    {this.state.deleteConfirmation &&
                    <div>
                        <h4 style={{textAlign: 'center'}}>Are you sure you want to permanently delete this topic?</h4>
                        <div style={{width:'100%'}}>
                            <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, width: 200}} variant={'danger'} onClick={this.permadelete} href={'/course/'+this.state.courseID}>Permanantly Delete </Button>
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
export default QuestionPage;

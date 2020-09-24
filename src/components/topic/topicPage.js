import React, {Component} from 'react';
import {Breadcrumb, Button, Container,} from "react-bootstrap";
import firebase from "../../firebase";
import RevisionTopic from "../course/revisionTopic";
import PageCard from "./page";
class TopicPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.location.pathname.split('/')[2],
            topicID: this.props.location.pathname.split('/')[3],
            topicName: '',
            topicDescription:'',
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
        firebase.database().ref('courses/'+this.state.courseID+'/revisionTopics/'+this.state.topicID).remove()
        firebase.database().ref('topics/').child(this.state.topicID).remove()
    }

    retrieveTopicData = async () =>{
        await firebase.database().ref('courses/'+this.state.courseID+'/revisionTopics').child(this.state.topicID).once('value', (snapshot) => {
            let data = snapshot.val();
            this.setState(
                {
                    topicName: data.topicName,
                    topicDescription: data.topicDescription,
                    visible: data.visible
                })
        })
    }

    getTopicData = () => {
        console.log('does it exists:' + this.state.topicIDExists)
         if (!this.state.topicIDExists) {
             firebase.database().ref('topics/').child(this.state.topicID)
                 .set({topicName: this.state.topicName})
                 .then(() => {console.log()})
         } else {
             firebase.database().ref('topics/'+this.state.topicID).once('value', (snapshot) => {
                     let data = snapshot.val();
                     let arr = []
                     for (let key in data.pages) {
                         if (data.pages.hasOwnProperty(key)) {
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
        let topicID= this.state.topicID;
        return tempCourses.map(function (topic) {
            console.log('loading the course'+ topic.toString());
            return <PageCard pageID={topic.toString()} topicID={topicID} courseID={cID}/>
        })
    }

    updateExists = async () => {
        await firebase.database().ref("topics/"+this.state.topicID).once('value', (snapshot) => {
            let exists = snapshot.exists();
            this.setState({topicIDExists: exists})
        })
    }

    makeVisible = () => {
        let topicData = firebase.database().ref('courses/'+this.state.courseID+'/revisionTopics/'+this.state.topicID+'/')
        topicData.set({
            topicDescription: this.state.topicDescription,
            topicName: this.state.topicName,
            visible: true
        }).then(() => this.setState({visible: true}))
    }

    makeInvisible = () => {
        let topicData = firebase.database().ref('courses/'+this.state.courseID+'/revisionTopics/'+this.state.topicID+'/')
        topicData.set({
            topicDescription: this.state.topicDescription,
            topicName: this.state.topicName,
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
                    <Breadcrumb.Item active>{this.state.topicName}</Breadcrumb.Item>
                </Breadcrumb>
                <h3>Topic Name: {this.state.topicName}</h3>
                <h4>description: {this.state.topicDescription}</h4>
                <p style={{marginBottom: 5}}>The Course ID: {this.state.courseID}</p>
                <p style={{marginBottom: 5}}>The Topic ID: {this.state.topicID}</p>
                <br/>
                <h4>Pages</h4>
                <div style={styles.scrollableContainer}>
                    <div style={{flex: '0 0 20%', float: 'left', height: '95%', width: 100, backgroundColor: 'rgba(227, 227, 227, 0.2)', margin: '10px', borderRadius: 10}}>
                        <p style={{marginTop: '50%', textAlign: 'center'}}><a href={'/add-pages/'+(this.state.topicID)+'/'+(this.state.courseID) +'/'+(this.state.pages.length + 1)+'/'}>Add a Page!</a></p>
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
export default TopicPage;

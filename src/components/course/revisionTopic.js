import React, {Component} from 'react';
import firebase from "../../firebase";
import {FaCheckCircle} from 'react-icons/fa';
import {FaTimesCircle} from 'react-icons/fa';
import Course from "../homepage/course";

class RevisionTopic extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.courseID,
            topicID: this.props.topicID,
            topicName: '',
            topicDescription:'',
            visible: false
        }
    }

    getTopicInformation = async() => {
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


    componentDidMount() {
        this.getTopicInformation().then(console.log(''));
    }

    render() {
        return(
            <a href={'/topic/'+this.props.courseID+'/'+this.state.topicID} style={{height: '95%', flex: '0 0 15%', float: 'left', margin: '10px', backgroundColor: '#86A3C3', color: 'inherit', textDecoration: 'none', borderRadius:10}}>
                <div style={{height: '70%'}}>
                    {this.state.visible && <FaCheckCircle style={{marginLeft: '80%', color: 'green', marginTop: '2%'}}/>}
                    {!this.state.visible && <FaTimesCircle style={{marginLeft: '80%', color: 'red', marginTop: '2%'}}/>}
                </div>
                <div style={{backgroundColor: 'rgb(255,255,255,0.2)', height:'30%'}}>
                    <hh5 style={{textAlign: 'left', color: 'white',fontSize:15, paddingLeft: 10, marginBottom: 0}}>{this.state.topicName}</hh5>
                    <p style={{textAlign: 'left', color: 'grey', fontSize: 10, paddingLeft:10}}>{this.state.topicID}</p>
                </div>
            </a>
        )
    }

}

export default RevisionTopic;

import React, {Component} from 'react';
import firebase from "../../firebase";
import {FaCheckCircle} from 'react-icons/fa';
import {FaTimesCircle} from 'react-icons/fa';
import Course from "../homepage/course";

class Questions extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.courseID,
            questionID: this.props.questionID,
            questionsName: '',
            topicDescription:'',
            visible: false
        }
    }

    getTopicInformation = async() => {
        await firebase.database().ref('courses/'+this.state.courseID+'/questions').child(this.state.questionID).once('value', (snapshot) => {
            let data = snapshot.val();
            this.setState(
                {
                    questionsName: data.questionsName,
                    questionsDescription: data.questionsDescription,
                    visible: data.visible
                })
        })
    }


    componentDidMount() {
        this.getTopicInformation().then(console.log(''));
    }

    render() {
        return(
            <a href={'/questions/'+this.props.courseID+'/'+this.state.questionID} style={{height: '95%', flex: '0 0 15%', float: 'left', margin: '10px', backgroundColor: '#86A3C3', color: 'inherit', textDecoration: 'none', borderRadius:10}}>
                <div style={{height: '70%'}}>
                    {this.state.visible && <FaCheckCircle style={{marginLeft: '80%', color: 'green', marginTop: '2%'}}/>}
                    {!this.state.visible && <FaTimesCircle style={{marginLeft: '80%', color: 'red', marginTop: '2%'}}/>}
                </div>
                <div style={{backgroundColor: 'rgb(255,255,255,0.2)', height:'30%'}}>
                    <hh5 style={{textAlign: 'left', color: 'white',fontSize:15, paddingLeft: 10, marginBottom: 0}}>{this.state.questionsName}</hh5>
                    <p style={{textAlign: 'left', color: 'grey', fontSize: 10, paddingLeft:10}}>{this.state.questionID}</p>
                </div>
            </a>
        )
    }

}

export default Questions;

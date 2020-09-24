import React, { Component } from "react";
import {Container, Image} from 'react-bootstrap';
import {FaCheckCircle} from 'react-icons/fa';
import {FaTimesCircle} from 'react-icons/fa';
import firebase from '../../firebase'


class HomePageCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.courseID,
            courseName: '',
            level:'',
            color: '',
            visible: false
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
                    visible: data.visible
                })
        })
    }

    componentDidMount() {
        this.getCourseInformation().then(console.log(''));
    }

    render() {
        return (
            <a href={'/course/'+this.props.courseID} style={{height: 350, width: 250, float: 'left', margin: '10px', backgroundColor: this.state.color, color: 'inherit', textDecoration: 'none', borderRadius:10}}>
                <div style={{height: '70%'}}>
                    {this.state.visible && <FaCheckCircle style={{marginLeft: '80%', color: 'green'}}/>}
                    {!this.state.visible && <FaTimesCircle style={{marginLeft: '80%', color: 'red'}}/>}
                </div>
                <div style={{backgroundColor: 'rgb(255,255,255,0.2)', height:'30%'}}>
                    <h3 style={{textAlign: 'left', color: 'white', fontSize: 25, paddingLeft: 10, marginBottom: 0}}>{this.state.courseName}</h3>
                    <h4 style={{textAlign: 'left', color: 'white', fontSize: 15, paddingLeft: 10}}>{this.state.level}</h4>
                    <p style={{textAlign: 'left', color: 'grey', fontSize: 10, paddingLeft:10}}>{this.state.courseID}</p>
                </div>
            </a>
        );
    }
}
const styles = {
    CourseBox: {

    }
};

export default HomePageCourses;

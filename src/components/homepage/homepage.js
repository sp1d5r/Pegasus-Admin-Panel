import React, { Component } from "react";
import {Container} from 'react-bootstrap';
import Courses from "./courses";
import Course from "./course";
import firebase from "../../firebase";
import HomePageCourses from "./homePageCourses";


class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.updateCourseFromDatabase().then(() => console.log(this.state.courses))
            } else {
                // No user is signed in.
                window.location.href='/login/';
            }
        });

    }

    updateCourseFromDatabase = async () => {
        firebase.database().ref('courses/').on('value', (snapshot) => {
            let data = snapshot.val();
            let arr = []
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    arr.push(key);
                }
            }
            this.setState({courses: arr});
            this.state.courses = arr;
        })

    };

    createCourses = () => {
        let tempCourses = this.state.courses;
        let nav = this.state.navigation;
        return tempCourses.map(function (course) {
            console.log('loading course: ', course);
            return (<HomePageCourses courseID={course.toString()} navigation={nav}/>);
        });
    }

    render() {
        return (
            <Container>
                <h3 style={{textAlign: 'left'}}>Recent Courses</h3>
                <p style={{textAlign: 'left'}}>Here is a list of all of the courses we currently offer, you can make add courses and delete them as you feel</p>
                <Courses />
                <h3 style={{textAlign: 'left'}}>All Courses</h3>
                <p style={{textAlign: 'left'}}>Here is a list of all the courses.</p>

                <div style={{height: 15000, width: '100%', flex: 1, flexWrap: 'wrap'}}>
                    {this.state.courses && this.createCourses()}
                </div>
            </Container>
        );
    }
}

export default Homepage;



import React, { Component } from "react";
import {Container, Image} from 'react-bootstrap';
import {FaPlus} from 'react-icons/fa';
import Course from "./course";
import firebase from '../../firebase'

//TODO:// load up all of the current courses from the firebase database xxx

class Courses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: [],
        }
    }

    componentDidMount() {
        this.updateCourseFromDatabase().then(() => console.log(this.state.courses))
    }

    updateCourseFromDatabase= async () =>{
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
            return (<Course courseID={course.toString()} navigation={nav}/>);
        });
    }


    render() {
        return (
            <div style={styles.scrollableContainer}>
                <div style={{flex: '0 0 20%', float: 'left', height: '95%', width: 100, backgroundColor: 'rgba(227, 227, 227, 0.2)', margin: '10px', borderRadius: 10}}>
                    <FaPlus style={{height: 50, width: 50, color: 'white', marginTop:50}}/>
                    <p style={{marginTop: 60}}><a href={'add/'}>Add New Course!</a></p>
                </div>
                {this.state.courses && this.createCourses()}
            </div>

        );
    }
}
const styles = {
    scrollableContainer: {
        display: 'flex', width: '100%', height: 300, backgroundColor: '#fafafa', overflowX: 'auto',
        overflowY: 'hidden', borderRadius: 10, alignItems: 'center'
    },
    backIcon: {
        marginTop: '10%',
        marginRight: '5%',
        height: 100,
        width: 100,
        marginBottom: 'auto',
        marginLeft: 'auto',
        color: "white",
    },
};

export default Courses;

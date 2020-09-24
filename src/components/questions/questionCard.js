import React, { Component } from "react";
import {FaCheckCircle} from 'react-icons/fa';
import {FaTimesCircle} from 'react-icons/fa';
import firebase from '../../firebase'

class QuestionCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.courseID,
            questionID: this.props.questionID,
            questionPageID: this.props.questionPageID,
            visible: false,
        }
    }

    getPageNumber =()=>{
        firebase.database()
            .ref('questions/'+this.state.questionID+'/questionPages')
            .child(this.state.questionPageID)
            .once('value', (snapshot) => {
                console.log(this.state)
                console.log(snapshot.val())
                let data = snapshot.val();
                this.setState({ visible: data.visible})})
    }

    componentDidMount() {
        this.getPageNumber()

    }

    render() {
        return (
            <a href={'/question-page/'+ this.props.courseID +'/' + this.props.questionID+'/'+this.props.questionPageID+'/'} style={{height: '95%', flex: '0 0 15%', float: 'left', margin: '10px', backgroundColor: '#FFAC81', color: 'inherit', textDecoration: 'none', borderRadius:10}}>
                <div style={{height: '70%'}}>
                    {this.state.visible && <FaCheckCircle style={{marginLeft: '80%', color: 'green', marginTop: '2%'}}/>}
                    {!this.state.visible && <FaTimesCircle style={{marginLeft: '80%', color: 'red', marginTop: '2%'}}/>}
                </div>
                <div style={{backgroundColor: 'rgb(255,255,255,0.2)', height:'30%', textAlign:'left'}}>
                    <h6 style={{paddingLeft:10}}>Page</h6>
                    <p style={{textAlign: 'left', color: 'grey', fontSize: 10, paddingLeft:10}}>{this.props.courseID}</p>
                </div>
            </a>
        );
    }
}

export default QuestionCard;

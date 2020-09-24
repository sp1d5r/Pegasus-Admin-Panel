import React, { Component } from "react";
import {FaCheckCircle} from 'react-icons/fa';
import {FaTimesCircle} from 'react-icons/fa';
import firebase from '../../firebase'

class PageCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.courseID,
            topicID: this.props.topicID,
            pageID: this.props.pageID,
            visible: false,
        }
    }

    getPageNumber =()=>{
        firebase.database()
            .ref('topics/'+this.state.topicID+'/pages')
            .child(this.state.pageID)
            .once('value', (snapshot) => {
                let data = snapshot.val();
                this.setState({ visible: data.visible})})
    }

    componentDidMount() {
        this.getPageNumber()
    }

    render() {
        return (
            <a href={'/page/'+ this.props.courseID +'/' + this.props.topicID+'/'+this.props.pageID+'/'} style={{height: '95%', flex: '0 0 15%', float: 'left', margin: '10px', backgroundColor: '#FFAC81', color: 'inherit', textDecoration: 'none', borderRadius:10}}>
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

export default PageCard;

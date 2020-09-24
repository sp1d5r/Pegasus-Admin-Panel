import {Breadcrumb, Button, Container, Form, Image} from "react-bootstrap";
import React, {Component} from "react";
import questions1Layout from '../../assets/questions1Layout.png'
import questions2Layout from '../../assets/questions2Layout.png'
import questions3Layout from '../../assets/questions3Layout.png'
import firebase from "../../firebase";
import moment from "moment";


class EditQuestionPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            courseID: this.props.location.pathname.split('/')[2],
            questionID: this.props.location.pathname.split('/')[3],
            questionPageID: this.props.location.pathname.split('/')[4],
            questionType: '',
            questionNumber: '',
            text1: '',
            marks: 0,
            image1: null,
            url1: "",
            answerImage: null,
            url2: "",
            answerStyle: "type1",
            answerText: "",
            deleteConfirmation: false,
        }
    }

    handleChange1 = e => {
        if (e.target.files[0]) {
            const image1 = e.target.files[0];
            this.setState(() => ({ image1 }));
        }
    };

    handleChangeAnswer = e => {
        if (e.target.files[0]) {
            const answerImage = e.target.files[0];
            this.setState(() => ({ answerImage }));
        }
    };

    answerImageUploader = () => {
        const { answerImage } = this.state;
        const extension = answerImage.name.split('.').pop();
        const date_create= moment().format("DD-MM-YYYY/hh:mm:ss")
        const imageName = this.state.courseID+'-'+this.state.questionID+date_create+'imageNumber-'+extension;
        const uploadTask = firebase.storage().ref(`answer-images/${imageName}`).put(answerImage);
        uploadTask.on(
            "state_changed",
            snapshot => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                this.setState({ progress });
            },
            error => {
                // Error function ...
                console.log(error);
            },
            () => {
                // complete function ...
                firebase.storage()
                    .ref("answer-images")
                    .child(imageName)
                    .getDownloadURL()
                    .then(url2 => {
                        this.setState({ url2 });
                    });
            }
        );
    };

    image1Uploader = () => {
        const { image1 } = this.state;
        const extension = image1.name.split('.').pop();
        const date_create= moment().format("DD-MM-YYYY/hh:mm:ss")
        const imageName = this.state.courseID+'-'+this.state.questionID+date_create+'imageNumber-'+extension;
        const uploadTask = firebase.storage().ref(`question-images/${imageName}`).put(image1);
        uploadTask.on(
            "state_changed",
            snapshot => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                this.setState({ progress });
            },
            error => {
                // Error function ...
                console.log(error);
            },
            () => {
                // complete function ...
                firebase.storage()
                    .ref("question-images")
                    .child(imageName)
                    .getDownloadURL()
                    .then(url1 => {
                        this.setState({ url1 });
                    });
            }
        );
    };

    createMarks = () => {
        let rows = [];
        for (let i = 1; i <= this.state.marks; i++) {
            rows.push(<div style={{height: 50, width: 50, backgroundColor: '#3CAEA3', marginBottom: 2, borderRadius: 5, textAlign: 'center', justifyContent:'center', alignItems: 'center'}}><p style={{textAlign: "center", color:'white', fontWeight: 'bold', marginTop: 10}}>{i}</p></div>);
        }
        return <div style={{display: 'flex', flex:1, flexDirection: 'row', justifyContent: 'space-around', width:'100%', flexWrap: 'wrap'}}>{rows}</div>;
    }



    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val.target.value;
        this.setState(state);
    }


    componentWillMount() {
        this.getPageInformation()
    }

    uploadToFirebase = () => {
        firebase.database().ref('questions/'+this.state.questionID+'/questionPages/'+this.state.questionPageID).update({
            questionType: this.state.questionType,
            text1: this.state.text1,
            marks: this.state.marks,
            answerStyle: this.state.answerStyle,
            answerText: this.state.answerText,
            questionNumber: this.state.questionNumber,
            imageUrl1: this.state.url1,
            answerImageUrl2: this.state.url2,
            visible: this.state.visible,
        }).then(() => {window.location.href= '/questions/'+this.state.courseID+'/'+this.state.questionID+'/'})
    }

    getPageInformation = async() => {
        await firebase.database().ref('questions/'+this.state.questionID+'/questionPages/').child(this.state.questionPageID).once('value', (snapshot) => {
            let data = snapshot.val();
            console.log(this.state)
            console.log(data)
            this.setState(
                {
                    questionType: data.questionType,
                    text1: data.text1,
                    marks: data.marks,
                    answerStyle: data.answerStyle,
                    answerText: data.answerText,
                    questionNumber: data.questionNumber,
                    url1: data.imageUrl1,
                    url2: data.answerImageUrl2,
                    visible: data.visible,
                })
        })
    }

    deleteCoursePage = () => {
        this.setState({deleteConfirmation: true})
    }

    cancelDelete =() => {
        this.setState({deleteConfirmation: false})
    }

    permadelete = () => {
        firebase.database().ref('questions/'+this.state.questionID+'/questionPages').child(this.state.questionPageID).remove()
    }

    makeVisible = () => {
        let pageData = firebase.database().ref('questions/'+this.state.questionID+'/questionPages/'+this.state.questionPageID+'/')
        pageData.set({
            questionType: this.state.questionType,
            text1: this.state.text1,
            marks: this.state.marks,
            answerStyle: this.state.answerStyle,
            answerText: this.state.answerText,
            questionNumber: this.state.questionNumber,
            imageUrl1: this.state.url1,
            answerImageUrl2: this.state.url2,
            visible: true,
        }).then(() => this.setState({visible: true}))
    }

    makeInvisible = () => {
        let pageData = firebase.database().ref('questions/'+this.state.questionID+'/questionPages/'+this.state.questionPageID+'/')
        pageData.set({
            questionType: this.state.questionType,
            text1: this.state.text1,
            marks: this.state.marks,
            answerStyle: this.state.answerStyle,
            answerText: this.state.answerText,
            questionNumber: this.state.questionNumber,
            imageUrl1: this.state.url1,
            answerImageUrl2: this.state.url2,
            visible: false,
        }).then(() => this.setState({visible: false}))
    }

    doSomething = (value) => {
        this.setState({questionType: 'question'+value}, () => {console.log('')})
    }

    render() {
        return(
            <Container style={{textAlign: 'left'}}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href={"/course/"+this.state.courseID}>Course</Breadcrumb.Item>
                    <Breadcrumb.Item href={'/questions/'+this.state.courseID+'/'+this.state.questionID+'/'}>Questions</Breadcrumb.Item>
                    <Breadcrumb.Item active>Edit Questions</Breadcrumb.Item>
                </Breadcrumb>
                <h3>Create new question page </h3>
                <p>Course ID: {this.state.courseID}</p>
                <p>Question ID: {this.state.topicID}</p>


                <div style={{display: 'flex', width: '85%', height:3000, marginLeft:'auto',marginRight: 'auto', marginTop: 30, marginBottom:50, backgroundColor: 'rgba(227, 227, 227, 0.2)', borderRadius: 5}}>
                    <div style={{float: 'left',height: '100%', width: '85%'}}>
                        <div style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '70%', height: '100%'}}>
                            {(this.state.questionType)[8]==='1' && <div>
                                <h3>Page type: {(this.state.questionType)[8]}</h3>
                                <form>
                                    <br/>
                                    <h5>Enter the heading</h5>
                                    <p>This is the heading, </p>
                                    <Form.Control name="courseName" placeholder={this.state.questionNumber} onChange={(val) => this.updateInputVal(val, 'questionNumber')}/>
                                    <Form.Text className="text-muted">
                                        If you don't want to add a question number leave this blank
                                    </Form.Text>
                                    <h5> Select the image here</h5>
                                    <Form.File id="formcheck-api-custom" custom>
                                        <Form.File.Input isValid={this.state.image1!= null} onChange={this.handleChange1}/>
                                        {this.state.image1==null && <Form.File.Label data-browse="Image File">
                                            Custom file input
                                        </Form.File.Label>}
                                        {this.state.image1!=null && <Form.File.Label data-browse="Image File">
                                            File Selected
                                        </Form.File.Label>}
                                        <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
                                    </Form.File>
                                    <Button
                                        onClick={this.image1Uploader}
                                        variant={'success'}
                                        style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                    >
                                        Upload Image
                                    </Button>
                                    <h5>Enter in the number of marks</h5>
                                    <Form.Control name="courseName" placeholder={this.state.marks} onChange={(val) => this.setState({marks: parseInt(val.target.value)})}/>
                                    <Form.Text className="text-muted">
                                        just write the number of marks no spaces.
                                    </Form.Text>
                                    <Form.Text className="text-muted">
                                        Double check that the text looks okay on the devices below:
                                    </Form.Text>
                                </form>
                                <h5>Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Topic Name</h3>
                                    </div>
                                    <div style={{display: 'flex', flex:1, flexDirection: 'row-reverse', width:'100%', height:'5%'}}>
                                        <p style={{marginTop: '2%', marginRight: '5%', fontWeight: 'bold'}}>{this.state.marks} marks</p>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '60%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', flexWrap: 'wrap',}}><p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{this.state.questionNumber+'\n'}</p>
                                            {this.state.url1 !== '' && <Image src={this.state.url1}
                                                                              alt="Uploaded Images"
                                                                              style={{width:'90%', height: 250, objectFit: 'contain'}}/>}
                                        </div>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => console.log('')}
                                            variant={'success'}
                                            style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                        >
                                            Show Answer
                                        </Button>
                                    </div>

                                </div>

                                <br/>
                                <h3>Answer Section</h3>
                                <p>Select a style of formatting for your answer page, only an image or a big block of text
                                    (keep number of marks next to each answer i.e. 1 mark) root 3 is irrational)</p>
                                <Form.Control as="select" name={"level"} value={this.state.answerStyle} placeholder={this.state.answerStyle} onChange={(val) => this.updateInputVal(val, 'answerStyle')}>
                                    <option value="type1">Text</option>
                                    <option value="type2">Image</option>
                                </Form.Control>
                                <Form.Text className="text-muted">
                                    Select the style either text or text
                                </Form.Text>

                                {this.state.answerStyle==="type1" && <div>
                                    <h5>Enter in the question</h5>
                                    <p>This layout only has a single piece of text centered in the middle. </p>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder={this.state.answerText} onChange={(val) => this.updateInputVal(val, 'answerText')}/>
                                    <br/>
                                </div>}

                                {this.state.answerStyle==="type2" && <div>
                                    <br/><br/>
                                    <h5>Upload your image</h5>
                                    <Form.File id="formcheck-api-custom" custom>
                                        <Form.File.Input isValid={this.state.answerImage!= null} onChange={this.handleChangeAnswer}/>
                                        {this.state.answerImage==null && <Form.File.Label data-browse="Image File">
                                            Custom file input
                                        </Form.File.Label>}
                                        {this.state.answerImage!=null && <Form.File.Label data-browse="Image File">
                                            File Selected
                                        </Form.File.Label>}
                                        <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
                                    </Form.File>
                                    <Button
                                        onClick={this.answerImageUploader}
                                        variant={'success'}
                                        style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                    >
                                        Upload Image
                                    </Button>
                                </div>}

                                <h5>Answer Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Answer</h3>
                                    </div>
                                    <div style={{display: 'flex', flex:1, flexDirection: 'row-reverse', width:'100%', height:'5%'}}>
                                        <p style={{marginTop: '2%', marginRight: '5%', fontWeight: 'bold'}}>{this.state.marks} marks</p>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '50%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', overflow: 'hidden', overflowY: 'auto', width: '100%', height: '100%'}}><p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{this.state.questionNumber+'\n'}</p>
                                            {this.state.answerStyle==="type2" &&  this.state.url2 !== '' && <Image src={this.state.url2}
                                                                                                                   alt="Uploaded Images"
                                                                                                                   style={{width:'90%', height: 250, objectFit: 'contain'}}/>}
                                            {this.state.answerStyle==="type1" && <p style={{textAlign: 'center', justifyContent: 'center', }}>  {this.state.answerText}</p>}

                                        </div>
                                    </div>
                                    <div style={{flex:1, flexDirection: 'row', display: 'block', marginLeft:'auto', marginRight:'auto', width:'80%', height:'15%',}}>
                                        {this.createMarks()}
                                    </div>

                                    <div>
                                        <Button
                                            onClick={() => console.log('')}
                                            variant={'success'}
                                            style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 0}}
                                        >
                                            Back
                                        </Button>
                                    </div>

                                </div>


                            </div>}
                            {(this.state.questionType)[8]==='2' && <div>
                                <h3>Page type: {(this.state.questionType)[8]}</h3>
                                <form>
                                    <br/>
                                    <h5>Enter the heading</h5>
                                    <p>This is the heading, </p>
                                    <Form.Control name="courseName" placeholder={this.state.questionNumber} onChange={(val) => this.updateInputVal(val, 'questionNumber')}/>
                                    <Form.Text className="text-muted">
                                        If you don't want to add a question number leave this blank
                                    </Form.Text>
                                    <h5> Select the image here</h5>
                                    <Form.File id="formcheck-api-custom" custom>
                                        <Form.File.Input isValid={this.state.image1!= null} onChange={this.handleChange1}/>
                                        {this.state.image1==null && <Form.File.Label data-browse="Image File">
                                            Custom file input
                                        </Form.File.Label>}
                                        {this.state.image1!=null && <Form.File.Label data-browse="Image File">
                                            File Selected
                                        </Form.File.Label>}
                                        <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
                                    </Form.File>
                                    <br/>
                                    <Button
                                        onClick={this.image1Uploader}
                                        variant={'success'}
                                        style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                    >
                                        Upload Image
                                    </Button>
                                    <br/>
                                    <h5> Enter the text here!</h5>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder={this.state.text1} onChange={(val) => this.updateInputVal(val, 'text1')}/>

                                    <h5>Enter in the number of marks</h5>
                                    <Form.Control name="courseName" placeholder={this.state.marks} onChange={(val) => this.setState({marks: parseInt(val.target.value)})}/>
                                    <Form.Text className="text-muted">
                                        just write the number of marks no spaces.
                                    </Form.Text>
                                    <Form.Text className="text-muted">
                                        Double check that the text looks okay on the devices below:
                                    </Form.Text>
                                </form>
                                <h5>Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Topic Name</h3>
                                    </div>
                                    <div style={{display: 'flex', flex:1, flexDirection: 'row-reverse', width:'100%', height:'5%'}}>
                                        <p style={{marginTop: '2%', marginRight: '5%', fontWeight: 'bold'}}>{this.state.marks} marks</p>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '60%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <p style={{textAlign: 'center', justifyContent: 'center'}}> <p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{this.state.questionNumber+'\n'}</p>  {this.state.text1}</p>
                                        <div style={{whiteSpace: 'pre-line', flexWrap: 'wrap',}}>
                                            {this.state.url1 !== '' && <Image src={this.state.url1}
                                                                              alt="Uploaded Images"
                                                                              style={{width:'90%', height: 250, objectFit: 'contain'}}/>}

                                        </div>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={() => console.log('')}
                                            variant={'success'}
                                            style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                        >
                                            Show Answer
                                        </Button>
                                    </div>

                                </div>

                                <br/>
                                <h3>Answer Section</h3>
                                <p>Select a style of formatting for your answer page, only an image or a big block of text
                                    (keep number of marks next to each answer i.e. 1 mark) root 3 is irrational)</p>
                                <Form.Control as="select" name={"level"} value={this.state.answerStyle} placeholder={this.state.answerStyle} onChange={(val) => this.updateInputVal(val, 'answerStyle')}>
                                    <option value="type1">Text</option>
                                    <option value="type2">Image</option>
                                </Form.Control>
                                <Form.Text className="text-muted">
                                    Select the style either text or text
                                </Form.Text>

                                {this.state.answerStyle==="type1" && <div>
                                    <h5>Enter in the question</h5>
                                    <p>This layout only has a single piece of text centered in the middle. </p>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder={this.state.answerText} onChange={(val) => this.updateInputVal(val, 'answerText')}/>
                                    <br/>
                                </div>}

                                {this.state.answerStyle==="type2" && <div>
                                    <br/><br/>
                                    <h5>Upload your image</h5>
                                    <Form.File id="formcheck-api-custom" custom>
                                        <Form.File.Input isValid={this.state.answerImage!= null} onChange={this.handleChangeAnswer}/>
                                        {this.state.answerImage==null && <Form.File.Label data-browse="Image File">
                                            Custom file input
                                        </Form.File.Label>}
                                        {this.state.answerImage!=null && <Form.File.Label data-browse="Image File">
                                            File Selected
                                        </Form.File.Label>}
                                        <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
                                    </Form.File>
                                    <Button
                                        onClick={this.answerImageUploader}
                                        variant={'success'}
                                        style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                    >
                                        Upload Image
                                    </Button>
                                </div>}

                                <h5>Answer Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Answer</h3>
                                    </div>
                                    <div style={{display: 'flex', flex:1, flexDirection: 'row-reverse', width:'100%', height:'5%'}}>
                                        <p style={{marginTop: '2%', marginRight: '5%', fontWeight: 'bold'}}>{this.state.marks} marks</p>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '50%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', overflow: 'hidden', overflowY: 'auto', width: '100%', height: '100%'}}><p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{this.state.questionNumber+'\n'}</p>
                                            {this.state.answerStyle==="type2" &&  this.state.url2 !== '' && <Image src={this.state.url2}
                                                                                                                   alt="Uploaded Images"
                                                                                                                   style={{width:'90%', height: 250, objectFit: 'contain'}}/>}
                                            {this.state.answerStyle==="type1" && <p style={{textAlign: 'center', justifyContent: 'center', }}>  {this.state.answerText}</p>}

                                        </div>
                                    </div>
                                    <div style={{flex:1, flexDirection: 'row', display: 'block', marginLeft:'auto', marginRight:'auto', width:'80%', height:'15%',}}>
                                        {this.createMarks()}
                                    </div>

                                    <div>
                                        <Button
                                            onClick={() => console.log('')}
                                            variant={'success'}
                                            style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 0}}
                                        >
                                            Back
                                        </Button>
                                    </div>

                                </div>


                            </div>}
                            {(this.state.questionType)[8]==='3' && <div>
                                <h3>Page type: {(this.state.questionType)[8]}</h3>
                                <form>
                                    <br/>
                                    <h5>Enter the heading</h5>
                                    <p>This is the heading, </p>
                                    <Form.Control name="courseName" placeholder={this.state.questionNumber} onChange={(val) => this.updateInputVal(val, 'questionNumber')}/>
                                    <Form.Text className="text-muted">
                                        If you don't want to add a question number leave this blank
                                    </Form.Text>
                                    <h5>Enter in the question</h5>
                                    <p>This layout only has a single piece of text centered in the middle. </p>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder={this.state.text1} onChange={(val) => this.updateInputVal(val, 'text1')}/>
                                    <br/>
                                    <h5>Enter in the number of marks</h5>
                                    <Form.Control name="courseName" placeholder={this.state.marks} onChange={(val) => this.setState({marks: parseInt(val.target.value)})}/>
                                    <Form.Text className="text-muted">
                                        just write the number of marks no spaces.
                                    </Form.Text>
                                    <Form.Text className="text-muted">
                                        Double check that the text looks okay on the devices below:
                                    </Form.Text>
                                </form>
                                <h5>Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Topic Name</h3>
                                    </div>
                                    <div style={{display: 'flex', flex:1, flexDirection: 'row-reverse', width:'100%', height:'5%'}}>
                                        <p style={{marginTop: '2%', marginRight: '5%', fontWeight: 'bold'}}>{this.state.marks} marks</p>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '60%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', flexWrap: 'wrap',}}>
                                            <p style={{textAlign: 'center', justifyContent: 'center'}}> <p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{this.state.questionNumber+'\n'}</p>  {this.state.text1}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Button
                                            onClick={this.uploadToFirebase}
                                            variant={'success'}
                                            style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                        >
                                            Show Answer
                                        </Button>
                                    </div>
                                </div>
                                <h3>Answer Section</h3>
                                <p>Select a style of formatting for your answer page, only an image or a big block of text
                                    (keep number of marks next to each answer i.e. 1 mark) root 3 is irrational)</p>
                                <Form.Control as="select" name={"level"} value={this.state.answerStyle} placeholder={this.state.answerStyle} onChange={(val) => this.updateInputVal(val, 'answerStyle')}>
                                    <option value="type1">Text</option>
                                    <option value="type2">Image</option>
                                </Form.Control>
                                <Form.Text className="text-muted">
                                    Select the style either text or text
                                </Form.Text>

                                {this.state.answerStyle==="type1" && <div>
                                    <h5>Enter in the question</h5>
                                    <p>This layout only has a single piece of text centered in the middle. </p>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder={this.state.answerText} onChange={(val) => this.updateInputVal(val, 'answerText')}/>
                                    <br/>
                                </div>}

                                {this.state.answerStyle==="type2" && <div>
                                    <br/><br/>
                                    <h5>Upload your image</h5>
                                    <Form.File id="formcheck-api-custom" custom>
                                        <Form.File.Input isValid={this.state.answerImage!= null} onChange={this.handleChangeAnswer}/>
                                        {this.state.answerImage==null && <Form.File.Label data-browse="Image File">
                                            Custom file input
                                        </Form.File.Label>}
                                        {this.state.answerImage!=null && <Form.File.Label data-browse="Image File">
                                            File Selected
                                        </Form.File.Label>}
                                        <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
                                    </Form.File>
                                    <Button
                                        onClick={this.answerImageUploader}
                                        variant={'success'}
                                        style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                    >
                                        Upload Image
                                    </Button>
                                </div>}

                                <h5>Answer Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Answer</h3>
                                    </div>
                                    <div style={{display: 'flex', flex:1, flexDirection: 'row-reverse', width:'100%', height:'5%'}}>
                                        <p style={{marginTop: '2%', marginRight: '5%', fontWeight: 'bold'}}>{this.state.marks} marks</p>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '50%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', overflow: 'hidden', overflowY: 'auto', width: '100%', height: '100%'}}><p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{this.state.questionNumber+'\n'}</p>
                                            {this.state.answerStyle==="type2" &&  this.state.url2 !== '' && <Image src={this.state.url2}
                                                                                                                   alt="Uploaded Images"
                                                                                                                   style={{width:'90%', height: 250, objectFit: 'contain'}}/>}
                                            {this.state.answerStyle==="type1" && <p style={{textAlign: 'center', justifyContent: 'center', }}>  {this.state.answerText}</p>}

                                        </div>
                                    </div>
                                    <div style={{flex:1, flexDirection: 'row', display: 'block', marginLeft:'auto', marginRight:'auto', width:'80%', height:'15%',}}>
                                        {this.createMarks()}
                                    </div>

                                    <div>
                                        <Button
                                            onClick={() => console.log('')}
                                            variant={'success'}
                                            style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 0}}
                                        >
                                            Back
                                        </Button>
                                    </div>

                                </div>

                            </div>}

                            <br/>
                            <Button
                                onClick={this.uploadToFirebase}
                                variant={'success'}
                                style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                            >
                                Upload to Firebase Backend
                            </Button>
                            { !this.state.visible && <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 50}} variant={'success'} onClick={this.makeVisible}>Make Visible!</Button>}
                            { this.state.visible && <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 50}} variant={'success'} onClick={this.makeInvisible}>Make Invisible!</Button>}
                            <div>
                                {!this.state.deleteConfirmation && <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 100}} variant={'danger'} onClick={this.deleteCoursePage}>Delete Page</Button>}
                                {this.state.deleteConfirmation &&
                                <div>
                                    <h5 style={{textAlign: 'center'}}>Are you sure you want to permanently delete this page?</h5>
                                    <div style={{width:'100%'}}>
                                            <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, width: 200}} variant={'danger'} onClick={this.permadelete} href={'/question/'+this.state.courseID+'/'+this.state.questionID+'/'}>Permanantly Delete </Button>
                                        <Button style={{display:'block', marginLeft: 'auto', marginRight:'auto', marginTop: 30, marginBottom: 100}} variant={'secondary'} onClick={this.cancelDelete}>Cancel</Button>
                                    </div>
                                </div>
                                }
                            </div>
                        </div>



                    </div>
                    <div style={{float: 'left', backgroundColor: 'rgba(227, 227, 227, 0.2)', height: '100%', width: '15%', borderTopRightRadius: 5, borderBottomRightRadius: 5, overflowY: 'auto',}}>
                        <div style={{textAlign: 'center', marginTop: 5}}>
                            <h5>Pick a Layout </h5>
                            <p>blue is text, grey are images</p>
                        </div>
                        <button onClick={() => this.doSomething(1)}><div style={{display: 'block', width: '95%', height: 150, backgroundColor: 'rgba(255, 255, 255, 0.8)', marginTop: 5, marginBottom: 5,marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                            <Image style={{display: 'block', height: 150, width: 100, marginLeft: 'auto', marginRight: 'auto'}} src={questions1Layout} rounded />
                        </div>
                        </button>
                        <button onClick={() => this.doSomething(2)}><div style={{width: '95%', height: 150, backgroundColor: 'rgba(255, 255, 255, 0.8)', marginTop: 5, marginBottom: 5,marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                            <Image style={{display: 'block', height: 150, width: 100, marginLeft: 'auto', marginRight: 'auto'}} src={questions2Layout} rounded />
                        </div>
                        </button>
                        <button onClick={() => this.doSomething(3)}><div style={{width: '95%', height: 150, backgroundColor: 'rgba(255, 255, 255, 0.8)', marginTop: 5, marginBottom: 5,marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                            <Image style={{display: 'block', height: 150, width: 100, marginLeft: 'auto', marginRight: 'auto'}} src={questions3Layout} rounded />
                        </div>
                        </button>
                    </div>
                </div>
                <br/>
            </Container>
        )
    }
}

export default EditQuestionPage;

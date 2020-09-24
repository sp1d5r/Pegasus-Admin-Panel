import {Breadcrumb, Button, Container, Form, Image} from "react-bootstrap";
import React, {Component} from "react";
import page1Layout from '../../assets/page1Layout.png'
import page2Layout from '../../assets/page2Layout.png'
import page3Layout from '../../assets/page3Layout.png'
import page4Layout from '../../assets/page4Layout.png'
import page5Layout from '../../assets/page5Layout.png'
import page6Layout from '../../assets/page6Layout.png'
import Preview from "./pageTypes/preview";
import firebase from "../../firebase";
import moment from "moment";

class AddPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            topicID: this.props.location.pathname.split('/')[2],
            courseID: this.props.location.pathname.split('/')[3],
            pageNumber: parseInt(this.props.location.pathname.split('/')[4]),
            pageType: 'page1',
            header: '',
            text1: '',
            text2: '',
            text3: '',
            image1: null,
            url1: "",
            image2: null,
            url2: "",
        }
    }

    handleChange1 = e => {
        if (e.target.files[0]) {
            const image1 = e.target.files[0];
            this.setState(() => ({ image1 }));
        }
    };

    image1Uploader = () => {
        const { image1 } = this.state;
        const extension = image1.name.split('.').pop();
        const date_create= moment().format("DD-MM-YYYY/hh:mm:ss")
        const imageName = this.state.courseID+'-'+this.state.topicID+date_create+'imageNumber-'+'1'+extension;
        const uploadTask = firebase.storage().ref(`topic-images/${imageName}`).put(image1);
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
                    .ref("topic-images")
                    .child(imageName)
                    .getDownloadURL()
                    .then(url1 => {
                        this.setState({ url1 });
                    });
            }
        );
    };

    handleChange2 = e => {
        if (e.target.files[0]) {
            const image2 = e.target.files[0];
            this.setState(() => ({ image2 }));
        }
    };

    image2Uploader = () => {
        const { image2 } = this.state;
        const extension = image2.name.split('.').pop();
        const date_create= moment().format("DD-MM-YYYY/hh:mm:ss")
        const imageName = this.state.courseID+'-'+this.state.topicID+date_create+'imageNumber-'+'2'+extension;
        const uploadTask = firebase.storage().ref(`images/${imageName}`).put(image2);
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
                    .ref("images")
                    .child(imageName)
                    .getDownloadURL()
                    .then(url2 => {
                        this.setState({ url2 });
                    });
            }
        );
    };

    handleUpload = () => {
        if (this.state.pageType[4] !== '2' || this.state.pageType !== '6') {
            this.setState({image1 : null});

        }
        if (this.state.pageType[4] !== '6'){
            this.setState({image2 : null});
        }

        if (this.state.image1 != null){
            this.image1Uploader();
        }
        if (this.state.image2 != null){
            this.image2Uploader();
        }
    }

    updateInputVal = (val, prop) => {
        const state = this.state;
        state[prop] = val.target.value;
        this.setState(state);
    }

    uploadToFirebase = () => {
        firebase.database().ref('topics/'+this.state.topicID+'/pages/').push({
            text1: this.state.text1,
            text2: this.state.text2,
            text3: this.state.text3,
            header: this.state.header,
            imageUrl1: this.state.url1,
            imageUrl2: this.state.url2,
            pageType: this.state.pageType,
            visible: false,
        }).then(() => {window.location.href= '/topic/'+this.state.courseID+'/'+this.state.topicID+'/'})
    }

    doSomething = (value) => {
        this.setState({pageType: 'page'+value}, () => {console.log('the page number '+this.state.pageType)})
    }

    render() {
        return(
            <Container style={{textAlign: 'left'}}>
                <Breadcrumb>
                    <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                    <Breadcrumb.Item href={"/course/"+this.state.courseID}>Course</Breadcrumb.Item>
                    <Breadcrumb.Item href={'/topic/'+this.state.courseID+'/'+this.state.topicID+'/'}>Topic</Breadcrumb.Item>
                    <Breadcrumb.Item active>Add Page</Breadcrumb.Item>
                </Breadcrumb>
                <h3>Create new page </h3>
                <p>Course ID: {this.state.courseID}</p>
                <p>Topic ID: {this.state.topicID}</p>
                <p>Page</p>


                <div style={{display: 'flex', width: '85%', height:2000, marginLeft:'auto',marginRight: 'auto', marginTop: 30, marginBottom:50, backgroundColor: 'rgba(227, 227, 227, 0.2)', borderRadius: 5}}>
                    <div style={{float: 'left',height: '100%', width: '85%'}}>
                        <div style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '70%', height: '100%'}}>
                            <br/>
                            {(this.state.pageType)[4]==='1' && <div>
                                <h3>Page type: {(this.state.pageType)[4]}</h3>
                                <form>
                                    <br/>
                                    <h5>Enter the heading</h5>
                                    <p>This is the heading, </p>
                                        <Form.Control name="courseName" placeholder="The header" onChange={(val) => this.updateInputVal(val, 'header')}/>
                                        <Form.Text className="text-muted">
                                            If you don't want a heading leave this empty
                                        </Form.Text>
                                    <h5>Enter in the text</h5>
                                    <p>This layout only has a single piece of text centered in the middle. </p>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder="Enter the information here..." onChange={(val) => this.updateInputVal(val, 'text1')}/>
                                    <Form.Text className="text-muted">
                                        Double check that the text looks okay on the devices below:
                                    </Form.Text>
                                </form>
                                <h5>Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Topic Name</h3>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '80%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', flexWrap: 'wrap',}}>
                                            <p style={{textAlign: 'center', justifyContent: 'center'}}> <p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{this.state.header+'\n'}</p>  {this.state.text1}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>}
                            {(this.state.pageType)[4]==='2' && <div>
                                <h3>Page type: {(this.state.pageType)[4]}</h3>
                                <form style={{justifyContent: 'center'}}>
                                    <br/>
                                    <h5>Enter the heading</h5>
                                    <p>This is the heading, </p>
                                    <Form.Control name="courseName" placeholder="The header" onChange={(val) => this.updateInputVal(val, 'header')}/>
                                    <Form.Text className="text-muted">
                                        If you don't want a heading leave this empty
                                    </Form.Text>
                                    <h5>Enter in the text</h5>
                                    <p>This layout only has a single piece of text centered in the middle</p>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder="Enter the information here..." onChange={(val) => this.updateInputVal(val, 'text1')}/>
                                    <br/>
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
                                    <Form.Text className="text-muted">
                                        Double check that the text looks okay on the devices below:
                                    </Form.Text>
                                    <Button
                                        onClick={this.handleUpload}
                                        variant={'success'}
                                        style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                    >
                                        Upload
                                    </Button>
                                </form>
                                <h5>Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Topic Name</h3>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '80%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', flexWrap: 'wrap',}}>
                                            <p style={{textAlign: 'center', justifyContent: 'center'}}>
                                                <p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                                                    {this.state.header+'\n'}
                                                </p>
                                                {this.state.text1}
                                                {this.state.url1 !== '' && <Image src={this.state.url1}
                                                                                  alt="Uploaded Images"
                                                                                  style={{width:'90%', height: 250, objectFit: 'contain'}}/>}


                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>}
                            {(this.state.pageType)[4]==='3' && <div>
                                <h3>Page type: {(this.state.pageType)[4]}</h3>
                                <form>
                                    <br/>
                                    <h5>Enter the heading</h5>
                                    <p>This is the heading, </p>
                                    <Form.Control name="courseName" placeholder="The header" onChange={(val) => this.updateInputVal(val, 'header')}/>
                                    <Form.Text className="text-muted">
                                        If you don't want a heading leave this empty
                                    </Form.Text>
                                    <br/>
                                    <h5>Enter in the text</h5>
                                    <p>This layout has two pieces of text, one at the top and one at the bottom</p>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder="Enter the upper information here..." onChange={(val) => this.updateInputVal(val, 'text1')}/>

                                    <br/>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder="Enter the lower information..." onChange={(val) => this.updateInputVal(val, 'text2')}/>

                                    <Form.Text className="text-muted">
                                        Double check that the text looks okay on the devices below:
                                    </Form.Text>
                                </form>
                                <h5>Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Topic Name</h3>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '80%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', flexWrap: 'wrap',}}>
                                            <p style={{textAlign: 'center', justifyContent: 'center'}}> <p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{this.state.header+'\n'}</p>  {this.state.text1+'\n \n \n'} {this.state.text2}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>}
                            {(this.state.pageType)[4]==='4' && <div>
                                <h3>Page type: {(this.state.pageType)[4]}</h3>
                                <form>
                                    <br/>
                                    <h5>Enter the heading</h5>
                                    <p>This is the heading, </p>
                                    <Form.Control name="courseName" placeholder="The header" onChange={(val) => this.updateInputVal(val, 'header')}/>
                                    <Form.Text className="text-muted">
                                        If you don't want a heading leave this empty
                                    </Form.Text>
                                    <br/>
                                    <h5>Enter in the text</h5>
                                    <p>This layout has three pieces of text, one at the top, one in the middle, and one at the bottom</p>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder="Enter the upper information here..." onChange={(val) => this.updateInputVal(val, 'text1')}/>

                                    <br/>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder="Enter the middle information..." onChange={(val) => this.updateInputVal(val, 'text2')}/>
                                    <br/>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder="Enter the lower information..." onChange={(val) => this.updateInputVal(val, 'text3')}/>

                                    <Form.Text className="text-muted">
                                        Double check that the text looks okay on the devices below:
                                    </Form.Text>
                                </form>
                                <h5>Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Topic Name</h3>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '80%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', flexWrap: 'wrap',}}>
                                            <p style={{textAlign: 'center', justifyContent: 'center'}}> <p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{this.state.header+'\n'}</p>  {this.state.text1+'\n \n \n'} {this.state.text2+'\n \n \n'} {this.state.text3}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>}
                            {(this.state.pageType)[4]==='5' && <div>
                                <h3>Page type: {(this.state.pageType)[4]}</h3>
                                <form style={{justifyContent: 'center'}}>
                                    <br/>
                                    <h5>Enter the heading</h5>
                                    <p>This is the heading, </p>
                                    <Form.Control name="courseName" placeholder="The header" onChange={(val) => this.updateInputVal(val, 'header')}/>
                                    <Form.Text className="text-muted">
                                        If you don't want a heading leave this empty
                                    </Form.Text>
                                    <h5>Enter in the text</h5>
                                    <p>This layout only has a text, an image, and then another piece of text afterwards</p>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder="Enter the upper information here..." onChange={(val) => this.updateInputVal(val, 'text1')}/>
                                    <br/>
                                    <Form.Control as="textarea" rows="3" name="courseName" placeholder="Enter the lower here..." onChange={(val) => this.updateInputVal(val, 'text2')}/>
                                    <br/>
                                    <br/>
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
                                    <Form.Text className="text-muted">
                                        Double check that the text looks okay on the devices below:
                                    </Form.Text>
                                    <Button
                                        onClick={this.handleUpload}
                                        variant={'success'}
                                        style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                    >
                                        Upload
                                    </Button>
                                    <Form.Text className="text-muted">
                                        To preview you have to upload the image...
                                    </Form.Text>
                                </form>
                                <h5>Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Topic Name</h3>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '80%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', flexWrap: 'wrap',}}>
                                            <p style={{textAlign: 'center', justifyContent: 'center'}}>
                                                <p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                                                    {this.state.header+'\n'}
                                                </p>
                                                {this.state.text1 + '\n \n'}
                                                {this.state.url1 !== '' && <Image src={this.state.url1}
                                                                                  alt="Uploaded Images"
                                                                                  style={{width:'90%', height: 150, objectFit: 'contain'}}/>}
                                                {'\n \n'+ this.state.text2}

                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>}
                            {(this.state.pageType)[4]==='6' && <div>
                                <h3>Page type: {(this.state.pageType)[4]}</h3>
                                <form style={{justifyContent: 'center'}}>
                                    <br/>
                                    <h5>Enter the heading</h5>
                                    <p>This is the heading, </p>
                                    <Form.Control name="courseName" placeholder="The header" onChange={(val) => this.updateInputVal(val, 'header')}/>
                                    <Form.Text className="text-muted">
                                        If you don't want a heading leave this empty
                                    </Form.Text>
                                    <br/>
                                    <h5> Select the images</h5>
                                    <p>This page contains two images</p>
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
                                    <p>Add the second image here</p>
                                    <Form.File id="formcheck-api-custom" custom>
                                        <Form.File.Input isValid={this.state.image2!= null} onChange={this.handleChange2}/>
                                        {this.state.image2==null && <Form.File.Label data-browse="Image File">
                                            Custom file input
                                        </Form.File.Label>}
                                        {this.state.image2!=null && <Form.File.Label data-browse="Image File">
                                            File Selected
                                        </Form.File.Label>}
                                        <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
                                    </Form.File>
                                    <Form.Text className="text-muted">
                                        Double check that the text looks okay on the devices below:
                                    </Form.Text>
                                    <Button
                                        onClick={this.handleUpload}
                                        variant={'success'}
                                        style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                                    >
                                        Upload
                                    </Button>
                                    <Form.Text className="text-muted">
                                        To preview you have to upload the image...
                                    </Form.Text>
                                </form>
                                <h5>Preview:</h5>
                                <div style={{display: 'block', marginLeft:'auto', marginRight: 'auto', width:350, height: 700, backgroundColor: 'white', borderRadius: 30}}>

                                    <div style={{width: '100%', height: '15%', backgroundColor: '#86A3C3', borderTopLeftRadius: 30, borderTopRightRadius: 30}}>
                                        <h3 style={{paddingTop: '10%', marginLeft: '5%', color: 'white'}}>Topic Name</h3>
                                    </div>

                                    <div style={{display: 'flex', marginLeft:'auto', marginRight: 'auto', marginTop: '5%' ,width: '80%', height: '80%',flex: 1, backgroundColor: 'white', justifyContent: 'center',  alignItems: 'center'}}>
                                        <div style={{whiteSpace: 'pre-line', flexWrap: 'wrap',}}>
                                            <p style={{textAlign: 'center', justifyContent: 'center'}}>
                                                <p style={{textAlign: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                                                    {this.state.header+'\n'}
                                                </p>
                                                {this.state.url1 !== '' && <Image src={this.state.url1}
                                                                                  alt="Uploaded Images"
                                                                                  style={{width:'90%', height: 150, objectFit: 'contain'}}/>}
                                                {'\n \n \n'}
                                                {this.state.url2 !== '' && <Image src={this.state.url2}
                                                                                  alt="Uploaded Images"
                                                                                  style={{width:'90%', height: 150, objectFit: 'contain'}}/>}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>}
                            <Button
                                onClick={this.uploadToFirebase}
                                variant={'success'}
                                style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 50}}
                            >
                                Upload to Firebase Backend
                            </Button>
                        </div>

                    </div>
                    <div style={{float: 'left', backgroundColor: 'rgba(227, 227, 227, 0.2)', height: '100%', width: '15%', borderTopRightRadius: 5, borderBottomRightRadius: 5, overflowY: 'auto',}}>
                        <div style={{textAlign: 'center', marginTop: 5}}>
                            <h5>Pick a Layout </h5>
                            <p>blue is text, grey are images</p>
                        </div>
                        <button onClick={() => this.doSomething(1)}><div style={{display: 'block', width: '95%', height: 150, backgroundColor: 'rgba(255, 255, 255, 0.8)', marginTop: 5, marginBottom: 5,marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                            <Image style={{display: 'block', height: 150, width: 100, marginLeft: 'auto', marginRight: 'auto'}} src={page1Layout} rounded />
                        </div>
                        </button>
                        <button onClick={() => this.doSomething(2)}><div style={{width: '95%', height: 150, backgroundColor: 'rgba(255, 255, 255, 0.8)', marginTop: 5, marginBottom: 5,marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                            <Image style={{display: 'block', height: 150, width: 100, marginLeft: 'auto', marginRight: 'auto'}} src={page2Layout} rounded />
                        </div>
                        </button>
                        <button onClick={() => this.doSomething(3)}><div style={{width: '95%', height: 150, backgroundColor: 'rgba(255, 255, 255, 0.8)', marginTop: 5, marginBottom: 5,marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                            <Image style={{display: 'block', height: 150, width: 100, marginLeft: 'auto', marginRight: 'auto'}} src={page3Layout} rounded />
                        </div>
                        </button>
                        <button onClick={() => this.doSomething(4)}><div style={{width: '95%', height: 150, backgroundColor: 'rgba(255, 255, 255, 0.8)', marginTop: 5, marginBottom: 5,marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                            <Image style={{display: 'block', height: 150, width: 100, marginLeft: 'auto', marginRight: 'auto'}} src={page4Layout} rounded />
                        </div>
                        </button>
                        <button onClick={() => this.doSomething(5)}><div style={{width: '95%', height: 150, backgroundColor: 'rgba(255, 255, 255, 0.8)', marginTop: 5, marginBottom: 5,marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                            <Image style={{display: 'block', height: 150, width: 100, marginLeft: 'auto', marginRight: 'auto'}} src={page5Layout} rounded />
                        </div>
                        </button>
                        <button onClick={() => this.doSomething(6)}><div style={{width: '95%', height: 150, backgroundColor: 'rgba(255, 255, 255, 0.8)', marginTop: 5, marginBottom: 5,marginLeft: 'auto', marginRight: 'auto', borderRadius: 3}}>
                            <Image style={{display: 'block', height: 150, width: 100, marginLeft: 'auto', marginRight: 'auto'}} src={page6Layout} rounded />
                        </div>
                        </button>
                    </div>
                </div>
                <br/>
            </Container>
        )
    }
}

export default AddPage;

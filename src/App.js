import React, {Component} from 'react';
import NavigationBar from "./components/navbar";
import './App.css';
import {Navbar} from "react-bootstrap";
import Homepage from "./components/homepage/homepage";
import {
    BrowserRouter,
    Switch,
    Route,
} from "react-router-dom";
import Add from "./components/add/Add";
import CoursePage from "./components/course/coursepage";
import AddRevisionNotes from './components/add-revision-notes/addRevisionNotes'
import EditPage from "./components/page/editPage";
import Edit from './components/edit/Edit'
import TopicPage from "./components/topic/topicPage";
import AddPage from './components/add-pages/addPage';
import Login from './components/Login';
import AddQuestions from "./components/add-questions/addQuestions";
import QuestionPage from "./components/questions/questionPage";
import AddQuestionPages from "./components/add-question-pages/AddQuestionPages";
import EditQuestionPage from './components/question-page/EditQuestionPage';
import Profile from "./components/profile/Profile";

import firebase from "./firebase";

class AppMain extends Component{
    constructor(props) {
        super(props);
        this.state = {
            signedIn: false,
            name: '',
        }
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({signedIn: true, name: firebase.auth().currentUser.displayName})
            } else {
                // No user is signed in.

            }
        });
    }


    render() {
        if (this.state.signedIn){
            return <BrowserRouter>
                <Switch>
                    <Route path={'/login'} exact component={Login} />
                    <Route path ="/" exact component={Homepage}/>
                    <Route path={'/add'} exact component={Add} />
                    <Route path={'/course'} component={CoursePage}/>
                    <Route path={'/add-revision-notes/'} component={AddRevisionNotes} />
                    <Route path={'/page/'} component={EditPage} />
                    <Route path={'/edit/'} component={Edit} />
                    <Route path={'/topic/'} component={TopicPage}/>
                    <Route path={'/add-pages/'} component={AddPage} />
                    <Route path={'/add-questions/'} component={AddQuestions} />
                    <Route path={'/questions/'} component={QuestionPage}/>
                    <Route path={'/add-question-pages/'} component={AddQuestionPages} />
                    <Route path={'/question-page/'} component={EditQuestionPage} />
                    <Route path={'/profile/'} component={Profile} />
                </Switch>
            </BrowserRouter>;
        } else {
            // No user is signed in.
            return  <BrowserRouter>
                <Switch>
                    <Route path ="/" component={Login}/>
                </Switch>
            </BrowserRouter>;
        }


    }
}



function App() {



  return (
    <div className="App">

      <NavigationBar />
      <AppMain />

    </div>
  );
}

export default App;

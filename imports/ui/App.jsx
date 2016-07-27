import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Tasks } from '../api/tasks.js';
 
import Task from './Task.jsx';
import { FormGroup, FormControl } from 'react-bootstrap';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
 
// App component - represents the whole app
/* export default class App extends Component {

 getTasks() {
    return [
      { _id: 1, text: 'This is task 1' },
      { _id: 2, text: 'This is task 2' },
      { _id: 3, text: 'This is task 3 5' },
    ];
  }


  renderTasks() {
    return this.props.getTasks().map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

 
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
        </header>
 
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}
 */


class App extends Component {

  handleSubmit(event) {
    event.preventDefault();

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),             // _id of logged in user
      username: Meteor.user().username,}  // username of logged in user
    );

    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }

      return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
      ));

/*    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
      ));*/
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount}/{this.props.tasks.length})</h1>
        </header>
 
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

        <ul>
          {this.renderTasks()}
        </ul>

        {/*<header>
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
          <form  onSubmit={this.handleSubmit.bind(this)}>
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form>
        </header>*/}

        <AccountsUIWrapper />

        { this.props.currentUser ?
        <form onSubmit={this.handleSubmit.bind(this)}>
            <FormGroup controlId="formBasicText">
              <FormControl
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
              />
              <FormControl.Feedback />
            </FormGroup>
          </form> : ''
        }
      </div>

    );
  } 
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);
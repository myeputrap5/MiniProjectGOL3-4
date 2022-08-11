import React, { Component } from 'react'
import TaskService from '../services/TaskService';

class CreateTaskComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // step 2
            id: this.props.match.params.id,
            name: '',
            assignee: '',
            deadline: ''
        }
        this.changeNameHandler =
            this.changeNameHandler.bind(this);
        this.changeAssigneeHandler =
            this.changeAssigneeHandler.bind(this);
        this.saveOrUpdateTask =
            this.saveOrUpdateTask.bind(this);
    }

    // step 3
    componentDidMount() {

        // step 4
        if (this.state.id === '_add') {
            return
        } else {
            TaskService.getTaskById(this.state.id).
            then((res) => {
                let task = res.data;
                this.setState({
                    name: task.name,
                    assignee: task.assignee,
                    deadline: task.deadline
                });
            });
        }
    }
    saveOrUpdateTask = (e) => {
        e.preventDefault();
        let task = { name: this.state.name, assignee:
             this.state.assignee, deadline: this.state.deadline };
        console.log('task => ' + JSON.stringify(task));

        // step 5
        if (this.state.id === '_add') {
            TaskService.createTask(task).then(res => {
                this.props.history.push('/tasks');
            });
        } else {
            TaskService.
            updateTask(task, this.state.id).then(res => {
                this.props.history.push('/tasks');
            });
        }
    }

    changeNameHandler = (event) => {
        this.setState({ name: event.target.value });
    }

    changeAssigneeHandler = (event) => {
        this.setState({ assignee: event.target.value });
    }

    changeEmailHandler = (event) => {
        this.setState({ deadline: event.target.value });
    }

    cancel() {
        this.props.history.push('/tasks');
    }

    getTitle() {
        if (this.state.id === '_add') {
            return <h3 className="text-center">Add Task</h3>
        } else {
            return <h3 className="text-center">Update Task</h3>
        }
    }
    render() {
        return (
            <div>
                <br></br>
        <div className="container">
            <div className="row">
               <div className="card col-md-6 offset-md-3 offset-md-3">
                            {
                                this.getTitle()
                            }
                            <div className="card-body">
                                <form>
            <div className="form-group">
              <label> First Name: </label>
                <input placeholder="First Name" 
                  name="name" className="form-control"
                    value={this.state.name} 
                      onChange={this.changeNameHandler} />
                          </div>
            <div className="form-group">
              <label> Asignee: </label>
                <input placeholder="Asignee" 
                   name="assignee" className="form-control"
                     value={this.state.assignee} 
                      onChange={this.changeAssigneeHandler} />
                                    </div>
            <div className="form-group">
                <label> Email : </label>
                    <input placeholder="Deadline" 
                       name="deadline" className="form-control"
                        value={this.state.deadline} 
                         onChange={this.changeEmailHandler} />
                                    </div>

             <button className="btn btn-success" 
                  onClick={this.saveOrUpdateTask}>Save
                    </button>
             <button className="btn btn-danger" 
                  onClick={this.cancel.bind(this)} 
                     style={{ marginLeft: "10px" }}>Cancel
                        </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateTaskComponent

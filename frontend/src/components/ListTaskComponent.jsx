import React, { Component } from 'react'
import TaskService from '../services/TaskService'

class ListTaskComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
                tasks: []
        }
        this.addTask = this.addTask.bind(this);
        this.editTask = this.editTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }

    deleteTask(id){
        TaskService.deleteTask(id).then( res => {
            this.setState({tasks: 
                this.state.tasks.
                filter(task => task.id !== id)});
        });
    }
    viewTask(id){
        this.props.history.push(`/view-task/${id}`);
    }
    editTask(id){
        this.props.history.push(`/add-task/${id}`);
    }

    componentDidMount(){
        TaskService.getTasks().then((res) => {
            if(res.data==null)
            {
                this.props.history.push('/add-task/_add');
            }
            this.setState({ tasks: res.data});
        });
    }

    addTask(){
        this.props.history.push('/add-task/_add');
    }

    render() {
        return (
            <div>
                 <h2 className="text-center">
                     Tasks List</h2>
                 <div className = "row">
                    <button className="btn btn-primary"
                     onClick={this.addTask}> Add Task</button>
                 </div>
                 <br></br>
                 <div className = "row">
                        <table className 
                        = "table table-striped table-bordered">

                            <thead>
                                <tr>
                                    <th> Task Name</th>
                                    <th> Task Asignee</th>
                                    <th> Deadline </th>
                                    <th> Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.tasks.map(
                                        task => 
                                        <tr key = {task.id}>
                                   <td> { task.name} </td>   
                                   <td> {task.assignee}</td>
                                   <td> {task.deadline}</td>
                                             <td>
                      <button onClick={ () => 
                          this.editTask(task.id)} 
                               className="btn btn-info">Update 
                                 </button>
                       <button style={{marginLeft: "10px"}}
                          onClick={ () => this.deleteTask(task.id)} 
                             className="btn btn-danger">Delete 
                                 </button>
                       <button style={{marginLeft: "10px"}} 
                           onClick={ () => this.viewTask(task.id)}
                              className="btn btn-info">View 
                                  </button>
                                    </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                 </div>
            </div>
        )
    }
}

export default ListTaskComponent

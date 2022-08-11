import axios from 'axios';

const task_API_BASE_URL = "http://localhost:9080/tasks";

class TaskService {

    getTasks(){
        return axios.get(task_API_BASE_URL);
    }

    createTask(task){
        return axios.post(task_API_BASE_URL, task);
    }

    getTaskById(taskId){
        return axios.get(task_API_BASE_URL + '/' + taskId);
    }

    updateTask(task, taskId){
        return axios.put(task_API_BASE_URL + '/' + taskId, task);
    }

    deleteTask(taskId){
        return axios.delete(task_API_BASE_URL + '/' + taskId);
    }
}

export default new TaskService()
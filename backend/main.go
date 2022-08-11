package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	Routers()
}

func Routers() {
	InitDB()
	defer db.Close()
	log.Println("Starting the HTTP server on port 9080")
	router := mux.NewRouter()
	router.HandleFunc("/tasks",
		GetTasks).Methods("GET")
	router.HandleFunc("/tasks",
		CreateTask).Methods("POST")
	router.HandleFunc("/tasks/{id}",
		GetTask).Methods("GET")
	router.HandleFunc("/tasks/{id}",
		UpdateTask).Methods("PUT")
	router.HandleFunc("/tasks/{id}",
		DeleteTask).Methods("DELETE")
	http.ListenAndServe(":9080",
		&CORSRouterDecorator{router})
}

/***************************************************/

//Get all tasks
func GetTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var tasks []Task
	result, err := db.Query("SELECT id, name," +
		"assignee,deadline from tasks")
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	for result.Next() {
		var task Task
		err := result.Scan(&task.ID, &task.Name,
			&task.Assignee, &task.Deadline)
		if err != nil {
			panic(err.Error())
		}
		tasks = append(tasks, task)
	}
	json.NewEncoder(w).Encode(tasks)
}

//Create task
func CreateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	stmt, err := db.Prepare("INSERT INTO tasks(name," +
		"assignee,deadline) VALUES(?,?,?)")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	name := keyVal["Name"]
	assignee := keyVal["assignee"]
	deadline := keyVal["deadline"]
	_, err = stmt.Exec(name, assignee, deadline)
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "New task was created")
}

//Get task by ID
func GetTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	result, err := db.Query("SELECT id, name,"+
		"assignee,deadline from tasks WHERE id = ?", params["id"])
	if err != nil {
		panic(err.Error())
	}
	defer result.Close()
	var task Task
	for result.Next() {
		err := result.Scan(&task.ID, &task.Name,
			&task.Assignee, &task.Deadline)
		if err != nil {
			panic(err.Error())
		}
	}
	json.NewEncoder(w).Encode(task)
}

//Update task
func UpdateTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	stmt, err := db.Prepare("UPDATE tasks SET name = ?," +
		"assignee= ?, deadline=? WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err.Error())
	}
	keyVal := make(map[string]string)
	json.Unmarshal(body, &keyVal)
	name := keyVal["Name"]
	assignee := keyVal["assignee"]
	deadline := keyVal["deadline"]
	_, err = stmt.Exec(name, assignee, deadline,
		params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Task with ID = %s was updated",
		params["id"])
}

//Delete Task
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	params := mux.Vars(r)
	stmt, err := db.Prepare("DELETE FROM tasks WHERE id = ?")
	if err != nil {
		panic(err.Error())
	}
	_, err = stmt.Exec(params["id"])
	if err != nil {
		panic(err.Error())
	}
	fmt.Fprintf(w, "Task with ID = %s was deleted",
		params["id"])
}

/***************************************************/

type Task struct {
	ID       string `json:"id"`
	Name     string `json:"Name"`
	Assignee string `json:"assignee"`
	Deadline string `json:"deadline"`
}

//Db configuration
var db *sql.DB
var err error

func InitDB() {
	db, err = sql.Open("mysql",
		"admin:admin@tcp(127.0.0.1:3306)/go_db")
	if err != nil {
		panic(err.Error())
	}
}

/***************************************************/

// CORSRouterDecorator applies CORS headers to a mux.Router
type CORSRouterDecorator struct {
	R *mux.Router
}

func (c *CORSRouterDecorator) ServeHTTP(rw http.ResponseWriter,
	req *http.Request) {
	if origin := req.Header.Get("Origin"); origin != "" {
		rw.Header().Set("Access-Control-Allow-Origin", origin)
		rw.Header().Set("Access-Control-Allow-Methods",
			"POST, GET, OPTIONS, PUT, DELETE")
		rw.Header().Set("Access-Control-Allow-Headers",
			"Accept, Accept-Language,"+
				" Content-Type, YourOwnHeader")
	}
	// Stop here if its Preflighted OPTIONS request
	if req.Method == "OPTIONS" {
		return
	}

	c.R.ServeHTTP(rw, req)
}

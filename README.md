# go-lang-mysql-react-crud

## Backend local setup
## CREDIT https://www.knowledgefactory.net/2022/01/go-lang-reactjs-mysql-crud-example-go.html
**Create database 'taskdb':**
```
CREATE DATABASE go_db;
```


**Create table 'tasks':**
```
CREATE TABLE `tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `assignee` varchar(200) NOT NULL,
  `deadline` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

ALTER TABLE `tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL 
  AUTO_INCREMENT, AUTO_INCREMENT=11;
```


**Initialize the Go project:**
Initialize the Go project using the following command
```
go mod init backend
```


**Adding the modules required for the project:**
```
go get github.com/gorilla/mux
go get github.com/go-sql-driver/mysql
```
**Run the backend app**
```
go run main.go
```



## Frontend local setup

**Step 1: The npm install installs all modules that are listed on package.json file and their 
            dependencies**
```
npm install
```

**Step 2: Run the Frontend application**
```
npm start
```
Access the URL via browser - http://localhost:3000

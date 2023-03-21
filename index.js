const http = require("http");
const DataBase = require("./db.js");

const database = new DataBase("data");

// TODO APP
// - add a todo                      POST /todos
// - read all todos                  GET /todos
// - mark a todo as done             PUT | PATCH /todos/:id
// - delete a todo                   DELETE /todos/:id

// todo
//  - title: string
//  - done: boolean (true or false)
//  - deadline: Date

// creating a server
const server = http.createServer();

// creating listeners
server.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/blogg") {
    let body = "";
    req
      .on("data", (data) => {
        body += data;
      })
      .on("end", () => {
        const todo = JSON.parse(body);
        database.create("todos", { ...todo, done: false });
        res.end("success");
      })
      .on("error", () => {
        res.end("failure");
      });
  }
});

server.on("request", (req, res) => {
  if (req.method === "GET" && req.url === "/blogg") {
    const todos = database.read("todos");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(todos));
  }
});

server.on("request", (req, res) => {
  if (req.method === "PUT" && /\/todos\/\d+$/.test(req.url)) {
    const id = Number(req.url.split("/")[2]);
    database.update("todos", id, { done: true });
    res.end("success");
  }
});

server.on("request", (req, res) => {
  if (req.method === "DELETE" && /\/todos\/\d+$/.test(req.url)) {
    const id = Number(req.url.split("/")[2]);
    database.delete("todos", id);
    res.end("success");
  }
});

// listening
server.listen(3004);
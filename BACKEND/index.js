const toDo = require("./todo.json");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

function generateId() {
  const notesIds = toDo.map((n) => n.id);
  const maxId = notesIds.length ? Math.max(...notesIds) : 0;
  const newId = maxId + 1;
  return newId;
}

function main() {
  //Create the app
  const app = express();
  app.use(cors());
  app.use(express.json());

  //requests on root response the route to API
  app.get("/", (request, response) => {
    response.send("<a href='/api/toDo'>Go to API</a> ");
  });

  //requests on API response the json
  app.get("/api/todo", (request, response) => {
    response.json(toDo);
  });

  //query id number on GET response the item-ID
  app.get("/api/todo/:id", (request, response) => {
    const id = Number(request.params.id);
    const task = toDo.find((item) => item.id === id);
    if (task) {
      response.send(task);
    } else {
      response.status(404).end();
    }
  });

  //query id number on DELETE pops the item-ID and response 204 status
  app.delete("/api/todo/:id", (request, response) => {
    const id = Number(request.params.id);
    notes = toDo.filter((note) => note.id !== id);
    data = JSON.stringify(notes);
    fs.writeFile("./todo.json", data, (err) => {
      if (err) {
        response.status(404).end();
      }
    });
    response.status(204).end();
  });

  //query object on body on POST push the object to json and response the JSON
  app.post("/api/todo", (request, response) => {
    const note = request.body;
    if (!note.content) {
      return response.status(400).json({
        error: 'required "content" field is missing',
      });
    }
    const newNote = {
      id: generateId(),
      content: note.content,
      date: new Date(),
      important: note.important || false,
    };
    var data = toDo.concat(newNote);
    data = JSON.stringify(data);
    fs.writeFile("./todo.json", data, (err) => {
      if (err) {
        response.status(404).end();
      }
    });
  });

  app.post("/api/todo/:id", (request, response) => {
    const id = Number(request.params.id);
    let note = toDo.find((note) => note.id === id);
    let notes = toDo.filter((note) => note.id !== id);
    if (note.important === true) {
      note.important = false;
    } else {
      note.important = true;
    }

    notes = notes.concat(note);
    data = JSON.stringify(notes);

    fs.writeFile("./todo.json", data, (err) => {
      if (err) {
        response.status(404).end();
      }
    });
    response.status(204).end();
  });

  app.put("/api/todo/:id", (request, response) => {
    const id = Number(request.params.id);
    let noteDone = toDo.find((note) => note.id === id);
    let notes = toDo.filter((note) => note.id !== id);

    noteDone.important = "done";

    var data = notes.concat(noteDone);
    data = JSON.stringify(data);

    fs.writeFile("./todo.json", data, (err) => {
      if (err) {
        response.status(404).end();
      } else {
        return response.status(200).json({
          status: "se modificó el campo solicitado",
        });
      }
    });
  });

  //deploy on port 3001 for dev and process.env.PORT for heroku deploy
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

main();

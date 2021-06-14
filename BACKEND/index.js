const express = require("express");
const cors = require("cors");
const model = require("./model");

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
    model.getAll().then((res) => {
      return response.json(res);
    });
  });

  //query id number on GET response the item-ID
  app.get("/api/todo/:id", (request, response) => {
    const id = Number(request.params.id);
    model.getById(id).then((res) => {
      if (res) {
        return response.send(res);
      } else {
        return response.status(404).json({
          status: "id not found",
        });
      }
    });
  });

  //query id number on DELETE pops the item-ID and response 204 status
  app.delete("/api/todo/:id", (request, response) => {
    const id = Number(request.params.id);
    model.deleteByID(id).then((res, err) => {
      if (err) {
        return response.status(404).end();
      } else {
        return response.status(204).end();
      }
    });
  });

  //query object on body on POST push the object to json and response the JSON
  app.post("/api/todo", (request, response) => {
    const note = request.body;
    if (!note.content) {
      return response.status(400).json({
        error: 'required "content" field is missing',
      });
    }
    model.addOneNote(note).then((res, err) => {
      if (err) {
        return response.status(404).end();
      } else {
        return response.status(204).json({
          status: "note added succesfully",
        });
      }
    });
  });

  //MAKE IMPORTANT
  app.post("/api/todo/:id", (request, response) => {
    const id = Number(request.params.id);
    model.makeImportant(id).then((res, err) => {
      if (err) {
        return response.status(404).end();
      } else {
        return response.status(200).json({
          status: "se modificó el campo solicitado",
        });
      }
    });
  });

  //MAKE ITS DONE
  app.put("/api/todo/:id", (request, response) => {
    const id = Number(request.params.id);
    model.itsDone(id).then((res, err) => {
      if (err) {
        return response.status(404).end();
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

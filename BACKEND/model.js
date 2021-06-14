const archivo = require("./todo.json");
const jsonfile = require("jsonfile");

function generateId() {
  const notesIds = archivo.map((n) => n.id);
  const maxId = notesIds.length ? Math.max(...notesIds) : 0;
  const newId = maxId + 1;
  return newId;
}

function getAll() {
  return jsonfile.readFile(__dirname + "/todo.json").then((notes) => notes);
}
exports.getAll = getAll;

exports.getById = function getById(id) {
  return getAll().then((res) => {
    return res.find((item) => item.id === id);
  });
};

exports.deleteByID = function deleteByID(id) {
  return getAll().then((notes) => {
    if (notes.length < 2) {
      addOneNote({ content: "", important: false });
    }

    let data = notes.filter((note) => note.id !== id);

    jsonfile.writeFile(__dirname + "/todo.json", data);
    return true;
  });
};

exports.addOneNote = function addOneNote(note) {
  return getAll().then((notes) => {
    const time = new Date();
    const newNote = {
      id: generateId(),
      content: note.content,
      date: String(
        time.getDate() +
          "/" +
          time.getMonth() +
          "/" +
          time.getFullYear() +
          "/ - " +
          time.getHours() +
          ":" +
          time.getMinutes() +
          ":" +
          time.getSeconds()
      ),
      important: note.important || false,
    };

    var data = notes.concat(newNote);

    jsonfile.writeFile(__dirname + "/todo.json", data);
  });
};

exports.makeImportant = function makeImportant(id) {
  return getAll().then((coll) => {
    let note = coll.find((note) => note.id === id);
    let notes = coll.filter((note) => note.id !== id);

    note.important = !note.important;
    data = notes.concat(note);

    jsonfile.writeFile(__dirname + "/todo.json", data);
    return true;
  });
};

exports.itsDone = function itsDone(id) {
  return getAll().then((coll) => {
    let note = coll.find((note) => note.id === id);
    let notes = coll.filter((note) => note.id !== id);

    note.important = "done";
    var data = notes.concat(note);

    jsonfile.writeFile(__dirname + "/todo.json", data);
    return true;
  });
};

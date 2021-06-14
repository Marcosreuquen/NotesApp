function createClone(coll) {
  const template = document.querySelector("#template-note-box");

  for (const item of coll) {
    template.content.querySelector(".note-box__id").textContent = item.id;

    template.content.querySelector(".note-box__content").textContent =
      item.content;
    template.content.querySelector(".note-box__date").textContent = item.date;
    template.content.querySelector(".note-box__important").textContent =
      item.important;

    const clone = document.importNode(template.content, true);
    const importantContainer = document.querySelector(".notes__important");
    const noImportantContainer = document.querySelector(".notes__no-important");
    const doneContainer = document.querySelector(".notes__done");

    if (item.important === true || item.important === "true") {
      importantContainer.appendChild(clone);
    } else if (item.important === "done") {
      doneContainer.appendChild(clone);
    } else {
      noImportantContainer.appendChild(clone);
    }
  }
}

function addNewNote(obj) {
  fetch(`http://localhost:3001/api/todo`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(obj),
  }).then(() => window.location.reload(true));
}

function deleteListener() {
  const botones = document.querySelectorAll(".button__delete");
  for (item of botones) {
    item.addEventListener("click", (evento) => {
      const note = evento.path.find((i) => i.className === "card note-box");
      const idDelEvento = note.querySelector(".note-box__id").textContent;
      fetch(`http://localhost:3001/api/todo/${idDelEvento}`, {
        method: "DELETE",
      }).then(() => window.location.reload(true));
    });
  }
}

function makeImportantListener() {
  const dato = document.querySelectorAll(".button__make-important");
  for (item of dato) {
    item.addEventListener("click", (evento) => {
      const note = evento.path.find((i) => i.className === "card note-box");
      const idDelEvento = note.querySelector(".note-box__id").textContent;

      fetch(`http://localhost:3001/api/todo/${idDelEvento}`, {
        method: "POST",
      }).then(() => window.location.reload(true));
    });
  }
}

function itsDoneListener() {
  const dato = document.querySelectorAll(".button__done");
  for (item of dato) {
    item.addEventListener("click", (evento) => {
      const note = evento.path.find((i) => i.className === "card note-box");
      const idDelEvento = note.querySelector(".note-box__id").textContent;

      fetch(`http://localhost:3001/api/todo/${idDelEvento}`, {
        method: "PUT",
      }).then(() => window.location.reload(true));
    });
  }
}

(function main() {
  fetch("http://localhost:3001/api/todo", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((res) => createClone(res))
    .then(() => deleteListener())
    .then(() => makeImportantListener())
    .then(() => itsDoneListener())
    .then(() => console.log());

  document
    .querySelector(".add-new-note")
    .addEventListener("submit", (evento) => {
      evento.preventDefault();
      const obj = {
        content: evento.target.content.value,
        important: evento.target.important.value,
      };
      console.log(obj);
      addNewNote(obj);
    });
})();

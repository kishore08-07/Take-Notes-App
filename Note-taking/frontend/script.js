

const displayNotes = () => {
    fetch("http://localhost:5000/notes", {
    }).then(res => res.json()).then(data => {
        let noteContainer = document.getElementById("display-container");
        noteContainer.innerHTML = '<h2>Notes</h2>';
        let noteCard;
        data?.notes.forEach(note => {
            noteCard = `
                <div class="note-card" id="note-${note._id}">
                    <p><strong>${note?.title}</strong></p>
                    <p>${note?.brief}</p>
                    <button onclick="editNote('${note._id}', '${note.title}', '${note.brief}')">Edit</button>
                    <button onclick="deleteNote('${note._id}')">Delete</button>
                </div>
            `;
            noteContainer.insertAdjacentHTML("beforeend", noteCard);
        });
    }).catch(e => {
        console.error("Could not load notes", e);
    });
};

const noteSubmit = (e) => {
    e.preventDefault();

    const title = document.getElementById("note-title").value;
    const brief = document.getElementById("note-brief").value;

    const noteId = document.getElementById("noteForm").getAttribute("data-note-id");

    if (noteId) {
        fetch("http://localhost:5000/notes", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: noteId, title, brief }),
        })
            .then(res => res.json())
            .then(() => {
                displayNotes();
                document.getElementById("noteForm").reset();
                document.getElementById("submit-button").value = "SUBMIT";
                document.getElementById("noteForm").removeAttribute("data-note-id");
            })
            .catch(e => {
                console.error("Error updating note", e);
            });
    } else {
        fetch("http://localhost:5000/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, brief }),
        })
            .then(res => res.json())
            .then(() => {
                displayNotes();
                document.getElementById("noteForm").reset();
            })
            .catch(e => {
                console.error("Error creating note", e);
            });
    }
};

const editNote = (id, currentTitle, currentBrief) => {
    document.getElementById("note-title").value = currentTitle;
    document.getElementById("note-brief").value = currentBrief;
    document.getElementById("submit-button").value = "Update";
    document.getElementById("noteForm").setAttribute("data-note-id", id);
};

const deleteNote = (id) => {
    fetch(`http://localhost:5000/note/${id}`, {
        method: "DELETE",
    })
        .then(res => res.json())
        .then(() => {
            displayNotes();
        })
        .catch(e => {
            console.error("Error deleting note", e);
        });
};

document.getElementById("noteForm").addEventListener("submit", noteSubmit);
displayNotes();

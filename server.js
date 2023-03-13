// requirements for the server to run
const fs = require('fs');
const path = require('path');
const notes = require('./db/db.json');

// express server setup
const express = require('express');
const app = express();
const port = 3001;

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

// function to create a new note
function newNote (note, notesArray) {
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return note;
}

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();
    const note = newNote(req.body, notes);
    res.json(note);
});

// function to delete a note
function destroyNote (id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        if (notesArray[i].id === id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );
            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    destroyNote(req.params.id, notes);
    res.json(notes);
});

// listener
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});




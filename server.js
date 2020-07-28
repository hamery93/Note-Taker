const fs = require("fs");
const express = require("express");
const path = require("path");

//Middleware Setup
const app = express();
const PORT = process.env.PORT || 8001;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public")); //static HTML/CSS/JS files are rendered 


//Notes array to hold notes
let notes = [];
let id;

//Storing read/write Note variables to make it easier to reference later on
const readNotes = () => {
    fs.readFile(__dirname + "/db/db.json", (err, response) => {
        if (err) throw err;
        notes = JSON.parse(response); //Parse to ensure we are dealing with array of objects
    });
};

const writeNotes = () => {
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err; //Using JSON.stringify to ensure notes rendered are strings
    });
};

//Server listening 
app.listen(PORT, () => {
    readNotes();
    console.log(`Listening on PORT ${PORT}`);
});

// HTML Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API Routes

app.get("/api/notes", (req, res) => {
    readNotes();
    res.json(notes);
});


app.post("/api/notes", (req, res) => {

    //Allows for unique ID's
    newNote = req.body;
    id = notes.length + 1;
    newNote.id = id++;
   
    notes.push(newNote);

    writeNotes();
    console.log("Note written to db.json");

    res.json(notes);

});

app.delete("/api/notes/:id", (req, res) => {
    var chosenId = parseInt(req.params.id);
    let foundNote = notes.find(note => note.id === chosenId);
       
    notes.splice(notes.indexOf(foundNote), 1);

    writeNotes();
    console.log("Note deleted from db.json");

    readNotes();

    res.json(foundNote);
})


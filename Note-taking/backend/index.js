import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { NoteModel } from './models/notes.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        message: "success"
    }).status(200);
});

app.get("/notes", async (req, res) => {
    const notes = await NoteModel.find();
    res.json({
        message: "success",
        notes: notes
    }).status(200);
});

app.post("/notes", async (req, res) => {
    let { title, brief } = req.body;
    let note = await NoteModel.insertMany([{ title: title, brief: brief }]);
    res.json({
        message: "note created successfully",
        id: note[0]._id
    }).status(201);
});

app.put("/notes", async (req, res) => {
    let { title, brief, _id } = req.body;
    try {
        let note = await NoteModel.updateOne({ _id }, { title, brief });
        if (note.modifiedCount === 0) {
            return res.status(404).json({
                message: "Note not found or no change in content"
            });
        }
        res.json({
            message: "Note updated successfully",
            id: _id
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({
            message: "An error occurred while updating the note",
            error: e.message
        });
    }
});

app.delete("/note/:_id", async (req, res) => {
    let { _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({
            message: "Invalid note ID"
        });
    }

    try {
        let deletedNote = await NoteModel.deleteOne({ _id: _id });
        if (deletedNote.deletedCount === 0) {
            return res.status(404).json({
                message: "Note not found"
            });
        }
        res.json({
            message: "Note deleted successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "An error occurred while deleting the note",
            error: e.message
        });
    }
});

app.listen(5000, () => {
    mongoose.connect("mongodb://localhost:27017/note-taker")
    console.log("Server is listening on 5000 ");
});




import mongoose from "mongoose";
const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    brief: { type: String, required: true },
})

export const NoteModel = mongoose.model('notes',NoteSchema)

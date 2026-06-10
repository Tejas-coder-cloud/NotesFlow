const Note = require("../models/Notes");

const createNote = async (req, res) => {

    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            message: "Title and content are required"
        });
    }

    const note = await Note.create({
        title,
        content,
        user: req.user.id
    });

    res.status(201).json(note);
};
const getNotes = async (req, res) => {

    const notes = await Note.find({
        user: req.user.id
    });

    res.status(200).json(notes);
};
const deleteNote = async (req, res) => {

    const note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: "Note deleted successfully"
    });
};
const updateNote = async (req, res) => {

    const { title, content } = req.body;

    const note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({
            message: "Note not found"
        });
    }

    const updatedNote = await Note.findByIdAndUpdate(
        req.params.id,
        {
            title,
            content
        },
        {
            new: true
        }
    );

    res.status(200).json(updatedNote);
};
module.exports = {
    createNote,
    getNotes,
    deleteNote,
    updateNote
};
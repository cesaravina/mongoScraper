// Dependencies
var mongoose = require("mongoose");

// Create the Schema class
var Schema = mongoose.Schema

// Create the NoteSchema
var NoteSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    }
});

// Create the Note model with NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
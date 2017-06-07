// Dependencies
var mongoose = require ("mongoose");

// Create the Schema class
var Schema = mongoose.Schema;

// Create story Schema
var StorySchema = new Schema({
    // require the tile
    title: {
        type: String, 
        required: true
    },

    // require the link
    link: {
        type: String,
        required: true
    },

    // require the image
    image: {
        type: String,
        required: true
    },

    // saved true/false
    saved: {
        type: Boolean,
        default: false
    },

    // Save the note's ObjectId and refer to the Note model
    note: {
        type: Schema.Types.ObjectId,
        re: "Note"
    }
});

// Story model created with StorySchema
var Story = mongoose.model("Story", StorySchema);

// Export the Story model
module.export = Story
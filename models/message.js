const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema ({
    text: { type: String },
    username: { type: String }
}, {
    versionKey: false,
    collection: "messages"
});

module.exports = mongoose.model('Message', MessageSchema);

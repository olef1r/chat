const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
 
const UserSchema = new Schema ({
    username: { type: String },
    password: { type: String }
}, {
    versionKey: false,
    collection: "users"
});

UserSchema.pre('save', function(next) {
    if(this.isModified('password') || this.isNew()) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);

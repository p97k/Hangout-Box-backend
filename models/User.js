const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 5,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        require: true,
        max: 20,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 8,
        unique: false
    },
    profile_image: {
        type: String,
        default: ""
    },
    cover_image: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname:{
        type: String,
        required: true
    },
    lastname: {
        type: String,
        require: true
    },    
    street: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    province: {
        type: String,
        require: true
    },
    postalCode: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    email: {
        type: String,
        index: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "member"         
    },
    creationDate: {
        type: Date,
        default: Date.now
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
    console.log('Im about to create ' + newUser)
    bcrypt.genSalt(10, function(err, salt) {
        console.log(newUser)
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            console.log(newUser.password + "password before hash")
            newUser.password = hash;
            console.log(hash + ' *8************************')
            newUser.save(callback);
        });
    });
}

module.exports.getUserByEmail = function(email, callback) {
    User.findOne({email: email}, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback); 
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    console.log(hash + ' ************************')
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}
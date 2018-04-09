const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MemberSchema = new Schema({
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
    },
    city: {
        type: String,
    },
    province: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    country: {
        type: String,
    },
    email: {
        type: String,
        default: Date.now
    },
    Password: {
        type: String,
        require: true
    },
    Role: {
	type: String,
	default: "member"         
    },
    CreationDate: {
        type: Date,
	require: true,
        default: Date.now
    }
})
mongoose.model('members', MemberSchema);
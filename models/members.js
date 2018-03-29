const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MemberSchema = new Schema({
    FirstName:{
        type: String,
        required: true
    },
    LastName: {
        type: String,
        require: true
    },
    Address : {
	Street: String,
	City:String,
	Province: String,
	PostalCode: String,
	Country: String	
    },
    Email: {
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
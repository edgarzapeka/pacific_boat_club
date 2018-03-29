const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MemberSchema = new Schema({
    BoatName:{
        type: String,
        required: true
    },
    BoatLengthInFeet: {
        type: String,
        require: true
    },
    BoatYear : {	
	Country: String	
    },
    BoatCapacityInPeople: {
        type: String,
        default: Date.now
    },
    BoatPictureUrl: {
        type: String,
        require: true
    } 
})
mongoose.model('boats', BoatSchema);
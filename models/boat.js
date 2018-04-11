const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BoatSchema = new Schema({
    BoatName:{
        type: String,        
    },
    BoatLengthInFeet: {
        type: String,        
    },
    BoatYear : {	
	type: Number	
    },
    BoatCapacityInPeople: {
        type: Number        
    },
    BoatPictureUrl: {
        type: String,        
    },
    RentedBy: {
        type: String
    } 
})

var Boat = module.exports = mongoose.model('boats', BoatSchema);
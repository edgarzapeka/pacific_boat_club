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
    RentedDate :{
        type: String
    } 
})
mongoose.model('boats', BoatSchema);


var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var config = require('./../config/');

const Boat = require('./../models/boat');

router.get("/list", (req, res) => {
    Boat.find({})
    .sort({date: 'desc'})
    .then( boats =>{
        res.json({  response: "success", data: boats});
    })
})

router.post("/add",  passport.authenticate('jwt', {session: false}), (req, res) => {
    var boat = new Boat()
    boat.BoatName = req.body.boatName,
    boat.BoatLengthInFeet = req.body.boatLengthInFeet,
    boat.BoatYear = req.body.boatYear,
    boat.BoatCapacityInPeople = req.body.boatCapacityInPeople,
    boat.BoatPictureUrl = req.body.boatPictureUrl,
    boat.RentedBy = req.body.rentedBy

    boat.save().then(boat => {
        res.json({  response: "success", message: "New Boat Added Successfully"})
    })
})

router.get("/getBoat/:id", passport.authenticate('jwt', {session: false}), (req, res) => {
    Boat.findOne({
        _id: req.params.id
    })
    .then( boat => {
        res.json({  response: "success", data: boat})
    }).catch(error => res.json({response: "failure", message: "boat not found"}));  
})

router.put('/edit',  passport.authenticate('jwt', {session: false}), (req, res) => {
    var boat = new Boat()
    boat._id = req.body._id
    boat.BoatName = req.body.boatName
    boat.BoatLengthInFeet = req.body.boatLengthInFeet
    boat.BoatYear = req.body.boatYear
    boat.BoatCapacityInPeople = req.body.boatCapacityInPeople
    boat.BoatPictureUrl = req.body.boatPictureUrl
    boat.RentedBy = req.body.rentedBy

    boat.save().then(boat => {
        res.json({  response: "success", message: "The Boat Updated Successfully"})
    })
})

router.delete('/delete/:id',  passport.authenticate('jwt', {session: false}), (req, res) => {
    Boat.remove({_id : req.params.id})
    .then( () => {
        res.json({  response: "success", message: "The Boat Deleted Successfully"})
    })
});


module.exports = router;
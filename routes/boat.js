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

router.post("/add", (req, res) => {
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

module.exports = router;
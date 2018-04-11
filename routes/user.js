var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var config = require('./../config/');
var User = require('../models/user');

// post register route
router.post('/register', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    var street = req.body.street;
    var city = req.body.city;
    var province = req.body.province;
    var postalcode = req.body.postalcode;
    var country = req.body.country;

    var newUser = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        street: street,
        city: city,
        province: province,
        postalCode: postalcode,
        country: country,
        userrole: "member",
        creationdate: Date.now
    });
    User.createUser(newUser, function(err, user) {
        if (err){
            return res.json({
                response: "failure",
                message: "Email already exists."
            });
        } 
    });

    res.json({
        response: "success",
        message: 'Successfully created new user.'
    })
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function (id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/authenticate', function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.json({ 
                response: "success",
                message: 'Authentication failed. User not found'
            });
        } else {
		 // check that password matches
            User.comparePassword(req.body.password, user.password, function(err, isMatch) {
                if (isMatch && !err) {
                    // create token
                    var token = jwt.sign(user.toJSON(), config.secret, {
                        expiresIn: 10080 // week in seconds
                    });
                    res.json({ response: "success", token: token });
                } else {
                    res.send( {
                        response: "failure",
                        message: 'Authentication failed. Invalid password'
                    });
                }
            });
        }
    });
});

router.get('/list', passport.authenticate('jwt', {session: false}), (req, res) => {
    User.find({})
    .sort({date: 'desc'})
    .then( users =>{
        res.json({ response: "success", data: users });
    })
}) 

module.exports = router;
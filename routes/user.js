var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jsonwebtoken');
var config = require('./../config/');


var User = require('../models/user');

// get register route
router.get('/register', function(req, res) {
    res.render('register');
});

// get login route
router.get('/login', function(req, res) {
    res.render('login');
});

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

    // validation
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        })
    } else {
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
            if (err) throw err;
            console.log(user);
        });

        req.flash('success-msg', "You are registered and can now login.");
        res.redirect('/users/login');
    }
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function (id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    function(email, password, done) {
        console.log('Email: ***** ' + email)
        console.log('PAssword: **** ' + password)
        User.getUserByEmail(email, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {message: 'Unknown User'});
            }
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid Password'});
                }
            });
        });
    }
));

router.post('/login', 
    passport.authenticate('local',{
        successRedirect: '/user/login/success', 
        failureRedirect: '/user/login/failure',
        failureFlash: true
    }),
    function(req, res) {
        res.redirect('/');
    }
);

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


router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/user/login');
});

router.get('/list', passport.authenticate('jwt', {session: false}), (req, res) => {
    User.find({})
    .sort({date: 'desc'})
    .then( users =>{
        res.json({ response: "success", data: users });
    })
}) 

router.get('/login/success', (req, res) => {
    res.json({response: "success", "token": "132ads/123"})
})

router.get('/login/failure', (req, res) => {
    res.json({response: "failure", message: "Email or Password is incorrect. Try again."})
})

module.exports = router;
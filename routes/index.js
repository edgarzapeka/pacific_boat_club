var express = require('express');
var router = express.Router();

// get home page
router.get('/', function(req, res) {
    res.json({response: 'success' });
});

function ensureAuthenticated(req, ensureAuthenticated, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', "You are not logged in");
        res.redirect('/users/login');
    }
} 

module.exports = router;
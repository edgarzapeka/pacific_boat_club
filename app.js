var fs = require('fs');
var express = require('express');
var methodOverride = require('method-override') ;
const flash = require('connect-flash');
const session = require('express-session');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var config = require('./config/');
var passport = require('passport');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');

const app = express();
const port = config.port;

require('./models/user');
const User = mongoose.model('User');
 
//Map global promise to get rid of warning
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/vidjot-dev', {
//     useMongoClient: true
// }).then(() => console.log('MongoDB connected...'))
// .catch( err =>console.log(err));

mongoose.connect(config.database, {
    useMongoClient: true
}).then(() => console.log('MongoDB connected...'))
.catch( err =>console.log(err));

 

//Load member model
require('./models/member');
const Member = mongoose.model('members');

require('./models/boat');
const Boat = mongoose.model('boats');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

app.use(methodOverride('_method'));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
}));

// passport initialization
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

/* app.use('/user/map', (req, res) =>{
    User.find({})
    .sort({date: 'desc'})
    .then( users =>{
        let usersData = users.map(u => `${u.street}, ${u.city}, ${u.province} ${u.postalCode}`)
        console.log(JSON.stringify(usersData))
        let result = JSON.stringify(usersData)
        res.render('usersmap',{
            title: 'users',
            result
        });
    })
}) */

var users = require('./routes/user');
var boats = require('./routes/boat')

app.use('/user', users)
app.use('/boat', boats)

app.listen(port, () => {
    console.log(`Server start on port ${port}`)
});

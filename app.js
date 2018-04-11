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

var routes = require('./routes/index');
var users = require('./routes/users');
 
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

//Load idea model
require('./models/ideas');
const Idea = mongoose.model('ideas');

//Load member model
require('./models/member');
const Member = mongoose.model('members');

require('./models/boat');
const Boat = mongoose.model('boats');


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

// bring in passport strategy we defined
//require('./config/passport')(passport);

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

app.use(flash());
app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', "You are not logged in");
        res.redirect('/users/login');
    }
}

 
app.get('/', (req, res) =>{
    const title = 'welcome'
    res.render('index',{
        title
    });
    //console.log(req.name)
}); 

app.get('/about',(req, res) =>{
    res.render('about');
});

// Add Idea form
app.get('/ideas/add', ensureAuthenticated, (req, res) => {     
    res.render('ideas/add');
});
app.get('/boats/add', ensureAuthenticated, (req, res) => {     
    res.render('boats/add');
});
app.get('/members/add', ensureAuthenticated, (req, res) => {     
    res.render('members/add');
});

// EditIdea form
app.get('/ideas/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea            
        });
        console.log(idea);
    })     
     
});

app.get('/boats/edit/:id', ensureAuthenticated, (req, res) => {
    Boat.findOne({
        _id: req.params.id
    })
    .then(boat => {
        res.render('boats/edit', {
            boat: boat            
        });
        console.log(boat);
    })     
     
});

app.get('/members/edit/:id', ensureAuthenticated, (req, res) => {
    Member.findOne({
        _id: req.params.id
    })
    .then(member => {
        res.render('members/edit', {
            member: member            
        });
        console.log(boat);
    })     
     
});
// Idea index page
app.get('/ideas', ensureAuthenticated, (req, res) => {
    Idea.find({})
    .sort({date: 'desc'})
    .then( ideas =>{
        res.render('ideas/index',{
            title: 'idea',
            ideas
        });
    })
     
});

// Boats index page
app.get('/boats', ensureAuthenticated, (req, res) => {
    Boat.find({})
    .sort({date: 'desc'})
    .then( boats =>{
        res.render('boats/index',{
            title: 'boat',
            boats
        });
    })
     
});

app.get('/members', ensureAuthenticated, (req, res) => {
    Member.find({})
    .sort({date: 'desc'})
    .then( members =>{
        res.render('members/index',{
            title: 'members',
            members
        });
    })
     
});

//Process form
app.post('/ideas', ensureAuthenticated, (req,res)=> {
    let errors = [];
    if(!req.body.title){
        errors.push({text:'please add a title'})
    }    
    if(!req.body.details){
        errors.push({text:'please add some details'})
    }
    if(errors.length > 0)
    {
        res.render('ideas/add',{
            errors,
            title: req.body.title,
            details: req.body.details
        })
        console.log(errors)
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
         new Idea(newUser)
         .save()
         .then(idea => {
            req.flash('success_msg','New Idea added')
             res.redirect('/ideas');
         })
    }
    console.log(req.body);
    //res.send('ok');
}) 

//Process form
app.post('/boats', ensureAuthenticated, (req,res)=> {
    let errors = [];
    if(!req.body.BoatName){
        errors.push({text:'please add a boat name'})
    }    
    if(!req.body.BoatLengthInFeet){
        errors.push({text:'please add the boat length'})
    }
    if(!req.body.BoatYear){
        errors.push({text:'please add the boat year'})
    }
    if(!req.body.BoatCapacityInPeople){
        errors.push({text:'please add the boat capacity'})
    }
    if(errors.length > 0)
    {
        res.render('boats/add',{
            errors,
            BoatName: req.body.BoatName,
            BoatLengthInFeet: req.body.BoatLengthInFeet,
            BoatYear: req.body.BoatYear,
            BoatCapacityInPeople: req.body.BoatCapacityInPeople
        })
        console.log(errors)
    } else {
        const newBoat = {
            BoatName: req.body.BoatName,
            BoatLengthInFeet: req.body.BoatLengthInFeet,
            BoatYear: req.body.BoatYear,
            BoatCapacityInPeople: req.body.BoatCapacityInPeople,
            BoatPictureUrl: req.body.BoatPictureUrl,
            RentedDate: req.body.RentedDate,
        }
         new Boat(newBoat)
         .save()
         .then(boat => {
            req.flash('success_msg','New boat added')
             res.redirect('/boats');
         })
    }
    console.log(req.body);
    //res.send('ok');
}) 

app.put('/ideas/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then( idea => {
        idea.title = req.body.title;
        idea.details = req.body.details
        idea.save()
        .then( idea => {
            req.flash('success_msg','Idea updated')
            res.redirect('/ideas')
        })
    })    
})

app.put('/boats/:id', ensureAuthenticated, (req, res) => {
    Boat.findOne({
        _id: req.params.id
    })
    .then( boat => {
        boat.BoatName = req.body.BoatName;
        boat.BoatLengthInFeet = req.body.BoatLengthInFeet;
        boat.BoatYear = req.body.BoatYear;
        boat.BoatCapacityInPeople = req.body.BoatCapacityInPeople;
        boat.BoatPictureUrl = req.body.BoatPictureUrl;
        boat.RentedDate = req.body.RentedDate;
        boat.save()
        .then( boat => {
            req.flash('success_msg','Boat: '+ boat.BoatName + ' updated')
            res.redirect('/boats')
        })
    })    
})

app.put('/members/:id', ensureAuthenticated, (req, res) => {
    Member.findOne({
        _id: req.params.id
    })
    .then( member => {
        member.firstname = req.body.firstname;
        member.lastname = req.body.lastname;
        member.street = req.body.street;
        member.city = req.body.city;
        member.province = req.body.province;
        member.postalCode = req.body.postalCode;
        member.country = req.body.country;
        member.save()
        .then( member => {
            req.flash('success_msg','Member updated')
            res.redirect('/members')
        })
    })    
})

app.delete('/ideas/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id : req.params.id})
    .then( () => {
        req.flash('success_msg','Idea removed')
        res.redirect('/ideas');
    })
    //res.send('delete');
});

app.delete('/boats/:id', ensureAuthenticated, (req, res) => {
    Boat.remove({_id : req.params.id})
    .then( () => {
        req.flash('success_msg','Boat removed')
        res.redirect('/boats');
    })
    //res.send('delete');
});

app.delete('/members/:id', ensureAuthenticated, (req, res) => {
    Member.remove({_id : req.params.id})
    .then( () => {
        req.flash('success_msg','Boat removed')
        res.redirect('/members');
    })
    //res.send('delete');
});

//User login route
app.get('/user/login',(req, res) => {
    res.send('login');
})

require('./models/user');
const User = mongoose.model('User');

app.use('/user/map', (req, res) =>{
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
})

app.use('/users', users);

app.listen(port, () => {
    console.log(`Server start on port ${port}`)
});

// server.js
// set up ======================================================================
var express  = require('express');
var app      = express();
var router   = express.Router();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/db');

// configuration ===============================================================
mongoose.connect(configDB.url);                   // connect to our database
require('./config/passport')(passport);           // pass passport for configuration

// set up our express application
app.use(morgan('dev'));                           // log every request to the console
app.use(cookieParser());                          // read cookies (needed for auth)
app.use(bodyParser.json());                       // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');                    // set up ejs for templating

// required for passport
app.use(session({
    secret: 'somethinginteresante',               // session secret
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());                      // persistent login sessions
app.use(flash());                                 // connect-flash for flash messages stored in session

// ROUTES FOR OUR API AND APP
// =============================================================================
app.use('/api/v1/', router);
require('./app/routers')(app,router,passport);

// START THE SERVER
// launch ======================================================================
app.listen(port);
console.log('App running on port ' + port);

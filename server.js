require("dotenv").config();
const path = require("path");
const express = require('express');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const SamlStrategy = require('passport-saml').Strategy;
const session = require('express-session');

const app = express();
const approuter = require("./routes/approuter");
const authrouter = require("./routes/auth");
var user= {};

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV !== "development",
  httpOnly: true,
  sameSite: 'none',
  maxAge: 4 * 60 * 60 * 1000
};
// set the view engine to ejs
app.set('view engine', 'ejs');
//set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: COOKIE_OPTIONS
}));
passport.use(new SamlStrategy(
  {
    path: process.env.SAML_CALLBACK_URL,
    entryPoint: process.env.SAML_ENTRYPOINT,
    issuer: process.env.SAML_ISSUER,
    cert: process.env.SAML_CERT, // cert must be provided
    identifierFormat: process.env.SAML_IDENTIFIER_FORMAT
  },
  function(profile, done) {
      console.log('---- passport.SamlStrategy . profile');
      console.log(profile);
      // findByEmail(profile.email, function(err, user) {
      //     if (err) {
      //     return done(err);
      //     }
      //     return done(null, user);
      // });
      user.username=profile.username;
      user.email=profile.email;
      user.userId=profile.nameID;
      done(null, user);
  })
);


passport.serializeUser(function(user, cb) {
  console.log('-----auth----- __passport.serializeUser__');
  console.log(user);
  process.nextTick(function() {
    console.log('-----auth----- __process.nextTick__ user.email:' + user.email);
    cb(null, { id: user.email, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  console.log('-----auth----- __passport.deserializeUser');
  console.log(user);    
  process.nextTick(function() {
    return cb(null, user);
  });
});


app.use(passport.authenticate('session'));

//bind router
app.use((req,res,next)=>{ 
  console.log(req.method + ' / req.originalUrl: '+ req.originalUrl + ' / . req.session.redirect_url: ' + req.session.redirect_url + ' / req.cookies.redirect_url: ' + req.cookies.redirect_url);
  console.log(req.session);
  console.log('# # # body:');
  res.locals.passport=req.session.passport;
  if(req.body){
    //console.log(req.body);
  }
  console.log('# # # param:');
  if(req.params){
    //console.log(req.params);
  }  
  console.log('# # # headers:');
  if(req.headers){
    //console.log(req.headers);
  }    
  if (req.originalUrl==req.cookies.redirect_url) {
    res.cookie('redirect_url', '/', COOKIE_OPTIONS);
    res.locals.redirect_url='/';
  }
  res.locals.sessionId = req.session.id;
  next();
}); 

app.use('/', approuter);
app.use('/', authrouter);

// error for pages/uri not served by this app
app.use('/', (req, res, next) => {
  res.status(404);
  res.render('pages/error', { errorcode:"404", error: "Page Not Found !!!" });
});

//bind error handllers
app.use(logErrors);
app.use(clientErrorHandler);

const HTTP_PORT = process.env.PORT||3000;
app.listen(HTTP_PORT);
console.log(`Server is listening on port ${HTTP_PORT}`);

// --- Error Handingling functions ---

// --- 1. Generic Error Logging ---
function logErrors (err, req, res, next) {
  console.error(err.stack);
  next(err);
}

// --- 2. api/code error handler ---
function clientErrorHandler (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  }else if(err){
    res.status(500);
    res.render('pages/error', { errorcode:"500", error: err });
  }else {
    next(err);
  }
}


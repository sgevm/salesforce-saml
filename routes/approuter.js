var express = require('express');
const router = express.Router();

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV !== "development",
  httpOnly: true,
  samesite: 'none'
};

// router.use(express.json());
// router.use(express.urlencoded({ extended: false }));

console.log('-----approuter-----');

// index page
router.get('/', function(req, res) {
    console.log('-----approuter----- / home.ejs . req.cookies.redirect_url: ' + req.cookies.redirect_url);
        var mascots = [
            { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
            { name: 'Tux', organization: "Linux", birth_year: 1996},
            { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
          ];
          var tagline = "No programming concept is complete without a cute animal mascot.";
          if(req.cookies.redirect_url=='/' || req.cookies.redirect_url==undefined || req.cookies.redirect_url=='undefined'){
            res.render('pages/home', {
              mascots: mascots,
              tagline: tagline
            });
          }else{
            res.redirect(req.cookies.redirect_url);
          }
});

// about page
router.get('/about', function(req, res) {
  console.log('-----approuter----- /about ');
  res.render('pages/about');
});


// # # # PROTECTED RESOURCE # # # 
// profile page
router.get('/profile', function(req, res) {
  console.log('-----approuter----- /profile');
  if (req.isAuthenticated()) {
    res.render('pages/profile');
  }else{
    res.cookie('redirect_url','profile',COOKIE_OPTIONS);
    req.session.redirect_url=req.originalUrl;
    res.redirect('login'+'/?redir=profile');
  }
  
});

// # # # PROTECTED RESOURCE # # # 
// API landing page
router.get('/api', function(req, res) {
    console.log('-----approuter----- /api ');
    
    if (req.isAuthenticated()) {
      res.render('pages/api');
    }else{
      res.cookie('redirect_url','api',COOKIE_OPTIONS);
      req.session.redirect_url=req.originalUrl;
      res.redirect('login'+'/?redir=api');
    }    
});

// get note
router.get('/api/note', function(req, res) {
    console.log('-----approuter----- /api/note:GET ');
    console.log(req.body);
    res.json(["username","sudeepghag","email","sudeep.ghag@gmail.com"]);
});

// add note
router.post('/api/note', function(req, res) {
    console.log('-----approuter----- /api/note:POST ');
    console.log('approuter - /api/note');
    console.log(req.body);
    res.json(req.body);
});



module.exports = router;
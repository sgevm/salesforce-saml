require("dotenv").config();
var express = require('express');
const passport = require("passport");
const router = express.Router();

const COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV !== "development",
  httpOnly: true,
  samesite: 'none'
};

console.log('-----auth-----');

// passport.use(new SamlStrategy(
//     {
//       path: process.env.SAML_CALLBACK_URL,
//       entryPoint: process.env.SAML_ENTRYPOINT,
//       issuer: process.env.SAML_ISSUER,
//       cert: process.env.SAML_CERT, // cert must be provided
//       identifierFormat: process.env.SAML_IDENTIFIER_FORMAT
//     },
//     function(profile, done) {
//         console.log('---- passport.SamlStrategy . profile');
//         console.log(profile);
//         // findByEmail(profile.email, function(err, user) {
//         //     if (err) {
//         //     return done(err);
//         //     }
//         //     return done(null, user);
//         // });
//         user.username=profile.username;
//         user.email=profile.email;
//         user.userId=profile.nameID;
//         done(null, user);
//     })
// );
  

// passport.serializeUser(function(user, cb) {
//     console.log('-----auth----- __passport.serializeUser__');
//     console.log(user);
//     process.nextTick(function() {
//       console.log('-----auth----- __process.nextTick__ user.email:' + user.email);
//       cb(null, { id: user.email, username: user.username });
//     });
// });
  
// passport.deserializeUser(function(user, cb) {
//     console.log('-----auth----- __passport.deserializeUser');
//     console.log(user);    
//     process.nextTick(function() {
//       return cb(null, user);
//     });
// });

router.post('/saml/callback',
		passport.authenticate('saml',
			{
				failureRedirect: '/',
				failureFlash: true
			}),
		function(req, res) {
			res.redirect('/');
		}
);

var path ='';

router.get("/login", (req,res,next)=>{
  const redir_url = req.cookies.redirect_url;
  path = (typeof redir_url==='undefined' || redir_url==='/'?'':redir_url);
  next();
  },passport.authenticate('saml',{
    successRedirect : "/" + path,
    failureRedirect : "/login",
}));


router.get('/logout', (req, res)=>{
    res.cookie('redirect_url', '/', COOKIE_OPTIONS);
    req.session.destroy();
    res.redirect('/');    
});


module.exports = router;
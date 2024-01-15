const express = require('express');
const expressSession = require('express-session');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5050;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const knex = require('knex')(require('./knexfile.js'));
app.use(express.static('./public'));

require('dotenv').config();

app.use(express.json());

app.use(helmet());
const allowedOrigins = ['https://kpi-trek.netlify.app','http://localhost:3000']; 

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.set('trust proxy', 1);

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', 
      secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    },
  })
);

// =========== Passport Config ============

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL, 
  proxy: true
},
function(_accessToken, _refreshToken, profile, done) {


  knex('user')
    .select('id')
    .where({ google_id: profile.id })
    .then(user => {
      if (user.length) {
        done(null, user[0]);
      } else {
        knex('user')
          .insert({
            google_id: profile.id,
            avatar_url: profile._json.picture,
            username: profile.displayName,
            email: profile.email
          })
          .then(userId => {
            done(null, { id: userId[0] });
          })
          .catch(err => {
            console.log('Error creating a user', err);
          });
      }
    })
    .catch(err => {
      console.log('Error fetching a user', err);
    });
}
));



passport.serializeUser((user, done) => {

  // Store only the user id in session
  done(null, user.id);
});

// `deserializeUser` receives a value sent from `serializeUser` `done` function
// We can then retrieve full user information from our database using the userId
passport.deserializeUser((userId, done) => {

  // Query user information from the database for currently authenticated user
  knex('user')
    .where({ id: userId })
    .then(user => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      // The full user object will be attached to request object as `req.user`
      done(null, user[0]);
    })
    .catch(err => {
      console.log('Error finding user', err);
    });
});


const authRoutes = require('./routes/auth');
const kpiRoutes = require('./routes/kpi-routes');
const requestRoutes = require('./routes/request-routes');
const jwtRoutes = require('./routes/jwt-auth');
const commentRoutes = require('./routes/comment-routes');
const userRoutes = require('./routes/user-routes.js');


// all routes
app.use('/auth', authRoutes);
app.use('/jwt-auth', jwtRoutes);
app.use('/kpis', kpiRoutes);
app.use('/requests',requestRoutes);
app.use('/comments',commentRoutes);
app.use('/users',userRoutes);

app.listen(PORT, () => {
    console.log(`running at http://localhost:${PORT}`);
  });

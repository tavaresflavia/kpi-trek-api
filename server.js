const express = require('express');
const expressSession = require('express-session');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5050;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const knex = require('knex')(require('./knexfile.js'));

require('dotenv').config();

app.use(express.json());

app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// =========== Passport Config ============

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
function(_accessToken, _refreshToken, profile, done) {
  console.log('Google profile:', profile);

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
  console.log('serializeUser (user object):', user);

  // Store only the user id in session
  done(null, user.id);
});

// `deserializeUser` receives a value sent from `serializeUser` `done` function
// We can then retrieve full user information from our database using the userId
passport.deserializeUser((userId, done) => {
  console.log('deserializeUser (user id):', userId);

  // Query user information from the database for currently authenticated user
  knex('user')
    .where({ id: userId })
    .then(user => {
      // Remember that knex will return an array of records, so we need to get a single record from it
      console.log('req.user:', user[0]);

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

// all routes
app.use('/auth', authRoutes);
app.use('/kpis', kpiRoutes);
app.use('/requests',requestRoutes);

app.listen(PORT, () => {
    console.log(`running at http://localhost:${PORT}`);
  });

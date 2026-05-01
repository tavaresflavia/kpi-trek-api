const express = require('express');
const expressSession = require('express-session');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 5050;

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const jwt = require('jsonwebtoken');

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
},
function(_accessToken, _refreshToken, profile, done) {
  knex('user')
    .select('id', 'google_id')
    .where({ google_id: profile.id })
    .orWhere({ email: profile.email })
    .first()
    .then(user => {
      if (user) {
        if (!user.google_id) {
          return knex('user')
            .where({ id: user.id })
            .update({
              google_id: profile.id,
              avatar_url: profile._json.picture
            })
            .then(() => done(null, { id: user.id }));
        }

        return done(null, { id: user.id });
      }

      return knex('user')
        .insert({
          google_id: profile.id,
          avatar_url: profile._json.picture,
          username: profile.displayName,
          email: profile.email
        })
        .then(userId => {
          done(null, { id: userId[0] });
        });
    })
    .catch(err => {
      console.log('Error fetching a user', err);
      done(err);
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

const authenticateRequest = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  const authHeader = req.headers.authorization;
  const authToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!authToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(authToken, process.env.SESSION_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid auth token' });
    }

    knex('user')
      .where({ id: decoded.id })
      .first()
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'Unauthorized' });
        }

        delete user.password;
        req.user = user;
        return next();
      })
      .catch(() => {
        return res.status(500).json({ message: 'Unable to authenticate request' });
      });
  });
};


const authRoutes = require('./routes/auth');
const kpiRoutes = require('./routes/kpi-routes');
const requestRoutes = require('./routes/request-routes');
const jwtRoutes = require('./routes/jwt-auth');
const commentRoutes = require('./routes/comment-routes');
const userRoutes = require('./routes/user-routes.js');


// all routes
app.use('/auth', authRoutes);
app.use('/jwt-auth', jwtRoutes);
app.use('/kpis', authenticateRequest, kpiRoutes);
app.use('/requests', authenticateRequest, requestRoutes);
app.use('/comments', authenticateRequest, commentRoutes);
app.use('/users', authenticateRequest, userRoutes);

app.listen(PORT, () => {
    console.log(`running at http://localhost:${PORT}`);
  });

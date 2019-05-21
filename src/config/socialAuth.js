import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { OAuth2Strategy as googleStrategy } from 'passport-google-oauth';
import { Strategy as twitterStrategy } from 'passport-twitter';
import { socialAuth } from '../routes/api/users/auth';

const socialCallback = async (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const username = profile.provider === 'twitter' ? profile.username : profile.name.givenName;
  const firstname = profile.provider === 'twitter' ? profile.displayName.split(' ')[0] : profile.name.givenName;
  const lastname = profile.provider === 'twitter' ? profile.displayName.split(' ')[1] || '' : profile.name.familyName;
  const image = profile.photos[0].value;
  const userDetail = await socialAuth(email,
    username, firstname, lastname, image);
  return done(null, userDetail);
};
passport.serializeUser((userDetail, done) => done(null, userDetail));
passport.use(new FacebookStrategy({
  clientID: process.env.facebookClientID,
  clientSecret: process.env.facebookClientSecret,
  callbackURL: process.env.facebookCallbackUrl,
  profileFields: ['id', 'email', 'displayName', 'name', 'photos'],
},
socialCallback));

passport.use(new googleStrategy({
  clientID: process.env.googleConsumerKey,
  clientSecret: process.env.googleConsumerSecret,
  callbackURL: process.env.googleCallbackUrl,
},
socialCallback));

passport.use(new twitterStrategy({
  consumerKey: process.env.twitterConsumerKey,
  consumerSecret: process.env.twitterConsumerSecret,
  callbackURL: process.env.twitterCallbackUrl,
  includeEmail: true
},
socialCallback));

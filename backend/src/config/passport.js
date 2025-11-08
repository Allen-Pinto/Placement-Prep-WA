import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL || 'http://localhost:5001'}/api/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google OAuth Profile:', profile.id);

        // Check if user exists
        let user = await User.findOne({
          $or: [
            { providerId: profile.id, provider: 'google' },
            { email: profile.emails[0].value }
          ]
        });

        if (user) {
          if (user.provider !== 'google') {
            user.provider = 'google';
            user.providerId = profile.id;
            user.isEmailVerified = true;
          }
          user.lastLogin = Date.now();
          await user.save({ validateBeforeSave: false });
          console.log('Existing user logged in:', user.email);
        } else {
          // Create new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value || null,
            provider: 'google',
            providerId: profile.id,
            isEmailVerified: true,
            lastLogin: Date.now(),
          });
          console.log('New Google user created:', user.email);
        }

        return done(null, user);
      } catch (error) {
        console.error('Google OAuth Error:', error);
        return done(error, null);
      }
    }
  )
);

// GitHub OAuth 
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL || 'https://placement-prep-wa.onrender.com'}/api/auth/github/callback`,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('GitHub OAuth Profile:', profile.id);

        // Get primary email from GitHub
        const email = profile.emails && profile.emails.length > 0 
          ? profile.emails.find(e => e.primary)?.value || profile.emails[0].value
          : `${profile.username}@github.local`;

        // Check if user exists
        let user = await User.findOne({
          $or: [
            { providerId: profile.id, provider: 'github' },
            { email: email }
          ]
        });

        if (user) {
          // Update existing user
          if (user.provider !== 'github') {
            user.provider = 'github';
            user.providerId = profile.id;
            user.isEmailVerified = true;
          }
          user.lastLogin = Date.now();
          await user.save({ validateBeforeSave: false });
          console.log('Existing user logged in:', user.email);
        } else {
          // Create new user
          user = await User.create({
            name: profile.displayName || profile.username,
            email: email,
            avatar: profile.photos[0]?.value || null,
            provider: 'github',
            providerId: profile.id,
            isEmailVerified: true,
            lastLogin: Date.now(),
          });
          console.log('New GitHub user created:', user.email);
        }

        return done(null, user);
      } catch (error) {
        console.error('GitHub OAuth Error:', error);
        return done(error, null);
      }
    }
  )
);

export default passport;